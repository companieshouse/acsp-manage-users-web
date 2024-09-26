import { NextFunction, Request, Response } from "express";
import { acspManageUsersAuthMiddleware, AcspOptions, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../lib/constants";
import { getLoggedInAcspNumber } from "../lib/utils/sessionUtils";

export const acspAuthMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {

    const acspNumber: string = getLoggedInAcspNumber(req.session);
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl
    };
    const acspOptions: AcspOptions = {
        acsp_number: acspNumber
        // user_role: UserRole.OWNER
    };
    return acspManageUsersAuthMiddleware(authMiddlewareConfig, acspOptions)(req, res, next);
};
