import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
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
        const membership = membershipResponse?.items?.[0];

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
