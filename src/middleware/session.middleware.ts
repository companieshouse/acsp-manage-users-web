import { SessionMiddleware, SessionStore, CookieConfig } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../lib/constants";
import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";

const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

const cookieConfig: CookieConfig = {
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieSecureFlag: constants.COOKIE_SECURE_ONLY !== "false",
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION)
};

export const sessionMiddleware = SessionMiddleware(cookieConfig, sessionStore, true);

export const csrfProtectionMiddleware = CsrfProtectionMiddleware({
    sessionStore,
    enabled: true,
    sessionCookieName: constants.COOKIE_NAME
});
