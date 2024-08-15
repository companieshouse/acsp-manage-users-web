import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../lib/constants";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    if (constants.isWhitelistedUrl(req.originalUrl)) {
        return next();
    }
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
