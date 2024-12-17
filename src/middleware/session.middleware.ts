import { EnsureSessionCookiePresentMiddleware, SessionMiddleware, SessionStore, CookieConfig } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import { NextFunction, Request, RequestHandler, Response } from "express";

const environmentsWithInsecureCookies = [
    "local"
];

export const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

const cookieConfig: CookieConfig = {
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieSecureFlag: constants.ENV_NAME !== undefined && !environmentsWithInsecureCookies.includes(constants.ENV_NAME),
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION)
};

export const sessionMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }

    return SessionMiddleware(cookieConfig, sessionStore, true)(req, res, next);
};

export const ensureSessionCookiePresentMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }

    return EnsureSessionCookiePresentMiddleware({
        ...cookieConfig
    })(req, res, next);
};
