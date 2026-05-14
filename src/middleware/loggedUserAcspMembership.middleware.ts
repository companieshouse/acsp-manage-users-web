import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData, userHasPermission } from "../lib/utils/sessionUtils";
import { getAcspMemberships, getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership, AcspStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import * as url from "node:url";
import logger from "../lib/Logger";
import { SignOutError } from "../lib/utils/errors/sign-out-error";

export const loggedUserAcspMembershipMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (isWhitelistedUrl(req.originalUrl) || req.originalUrl.startsWith(constants.ACCESS_DENIED_FULL_URL)) {
        return next();
    }

    const currentPath = url.parse(req.originalUrl, true).pathname ?? "";
    const onDashboard = currentPath === constants.DASHBOARD_FULL_URL || currentPath === constants.getFullUrl("");
    const acspMembershipInSession:AcspMembership = getLoggedUserAcspMembership(req.session);

    if (!acspMembershipInSession || onDashboard) {
        logger.info("Fetching / updating ACSP membership for logged in user");
        const membershipResponse = await getMembershipForLoggedInUser(req);
        let membership = membershipResponse?.items?.[0];

        if (userHasPermission(req.session, "/admin/acsp/manage")) {
            logger.info("User has CH internal admin permissions, setting admin ACSP membership in session");
            membership = await constructAdminAcspMembership(req);
        }

        if (!membership) {
            logger.error("No membership found for logged in user");
            throw new Error("No membership found for logged in user");
        }

        if (membership.acspStatus === AcspStatus.CEASED) {
            logger.info("User's ACSP membership has ceased, redirecting to sign out");
            throw new SignOutError("User's ACSP membership has ceased, redirecting to sign out");
        }

        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, membership);
    }

    return next();

};

const constructAdminAcspMembership = async (req: Request): Promise<AcspMembership> => {
    // Retrieve ACSP number from session and use it to construct a temporary ACSP membership with 
    // owner role for users with CH internal admin permissions
    const acspNumber = req?.session?.data?.signin_info?.acsp_number!;

    // Retrieve ACSP name from any of the ACSP memberships
    const ownerMembers = await getAcspMemberships(req, acspNumber, false);
    const acspName = ownerMembers?.items?.[0]?.acspName!;

    const adminMembership: AcspMembership = {
        acspNumber,
        acspName,
        userRole: "owner",
        acspStatus: AcspStatus.ACTIVE,
    } as AcspMembership;
    return adminMembership;
};