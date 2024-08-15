import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";

export const loggedUserAcspMembershipMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }
    const acspMembershipInSession: AcspMembership = getLoggedUserAcspMembership(req.session);
    if (!acspMembershipInSession) {
        const membership = (await getMembershipForLoggedInUser(req)).items[0];
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, membership);
    }
    next();
};
