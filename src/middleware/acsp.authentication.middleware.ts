import { NextFunction, Request, Response } from "express";
import { acspManageUsersAuthMiddleware, AcspOptions, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../lib/constants";
import { UserRole } from "@companieshouse/web-security-node/dist/scopes-permissions/acspManageUsersAuthMiddleware";

export const acspAuthMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {

    // update to retrieve actual acsp number
    const acspNumber: string = req.session?.getExtraData("test") || "";
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl
    };
    const acspOptions: AcspOptions = {
        acsp_number: acspNumber,
        // hard code to owner for now
        user_role: UserRole.OWNER
    };
    return acspManageUsersAuthMiddleware(authMiddlewareConfig, acspOptions)(req, res, next);
};
