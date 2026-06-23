import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData, userHasPermission } from "../lib/utils/sessionUtils";
import { getAcspMemberships, getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership, AcspStatus, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import * as url from "node:url";
import logger from "../lib/Logger";
import { SignOutError } from "../lib/utils/errors/sign-out-error";
import { isFeatureEnabled } from "../lib/utils/environmentValue";

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

        if (isFeatureEnabled(constants.FEATURE_FLAG_PERMIT_CH_ADMIN_TO_UNLOCK_ACCOUNTS)) {
            if (userHasPermission(req.session, constants.ADMIN_ACSP_USER_CREATE)) {
                logger.info("User has CH internal admin permissions, setting admin ACSP membership in session");
                membership = await constructChAdminAcspMembership(req);
            }
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

const constructChAdminAcspMembership = async (req: Request): Promise<AcspMembership> => {
    const acspNumber = req?.session?.data?.signin_info?.acsp_number;
    if (!acspNumber) {
        logger.error("ACSP number not found in session for CH internal admin user");
        throw new Error("ACSP number not found in session for CH internal admin user");
    }

    const acspMemberships = await getAcspMemberships(req, acspNumber, false);
    const acspName = acspMemberships?.items?.[0]?.acspName;
    if (!acspName) {
        logger.error(`ACSP name not found for ACSP number ${acspNumber}`);
        throw new Error(`ACSP name not found for ACSP number ${acspNumber}`);
    }

    return {
        acspNumber,
        acspName,
        userRole: UserRole.OWNER,
        acspStatus: AcspStatus.ACTIVE,
    } as AcspMembership;
};