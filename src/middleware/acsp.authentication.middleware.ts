import { NextFunction, Request, Response } from "express";
import { acspManageUsersAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../lib/constants";
import { getLoggedInAcspNumber } from "../lib/utils/sessionUtils";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";

export const acspAuthMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }
    const acspNumber: string = getLoggedInAcspNumber(req.session);
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl,
        acspNumber
    };
    return acspManageUsersAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
