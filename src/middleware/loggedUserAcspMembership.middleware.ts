import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";

export const loggedUserAcspMembershipMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const acspMembershipInSession: AcspMembership = getLoggedUserAcspMembership(req.session);
    if (!acspMembershipInSession) {
        const membership = (await getMembershipForLoggedInUser(req)).items[0];
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, membership);
    }
    next();
};
