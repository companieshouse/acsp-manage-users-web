import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, isAdminUser, setExtraData } from "../lib/utils/sessionUtils";
import { getAcspMemberships, getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import logger from "../lib/Logger";

export const loggedUserAcspMembershipMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (isWhitelistedUrl(req.originalUrl)) {

        return next();
    }

    if (isAdminUser(req.session)) {
        const acspNumber = req.query?.AcspNumber as string;
        logger.info(`User permitted to enter ${constants.SERVICE_NAME} service.`);
        logger.info("This is an admin user");
        const acspMembershipInSession: AcspMembership = getLoggedUserAcspMembership(req.session);
        if (!acspMembershipInSession) {
            const membership = (await getAcspMemberships(req, acspNumber));
            setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, membership);
        }
        return next();
    }

    const acspMembershipInSession: AcspMembership = getLoggedUserAcspMembership(req.session);
    if (!acspMembershipInSession) {
        const membership = (await getMembershipForLoggedInUser(req)).items[0];
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, membership);
    }
    next();
};
