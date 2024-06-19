import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../lib/constants";
import logger from "../lib/Logger";

const WHITELISTED_URLS: string[] = [
    constants.LANDING_URL + constants.HEALTHCHECK
];

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {

    if (isWhitelistedUrl(req.originalUrl)) {
        logger.debug("whitelist endpoint called, skipping authentication.");
        return next();
    }

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};

const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);
