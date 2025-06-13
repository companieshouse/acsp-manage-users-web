import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import * as url from "node:url";

export const loggedUserAcspMembershipMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (isWhitelistedUrl(req.originalUrl) || req.originalUrl.startsWith(constants.ACCESS_DENIED_FULL_URL)) {
        return next();
    }
    const acspMembershipInSession: AcspMembership = getLoggedUserAcspMembership(req.session);

    const currentPath = url.parse(req.originalUrl, true).pathname || "";
    const onDashboard = currentPath === constants.DASHBOARD_FULL_URL || currentPath === constants.getFullUrl("");

    if (!acspMembershipInSession || onDashboard) {
        const membership = (await getMembershipForLoggedInUser(req)).items[0];
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, membership);
    }
    next();
};
