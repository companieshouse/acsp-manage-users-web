import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../lib/constants";

const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

/*
    Passing true to SessionMiddleware means that a session will be created if none found.

    cookieSecureFlag will default to true unless there is an env variable COOKIE_SECURE_ONLY
    which has a string value of "false"
*/

export const sessionMiddleware = SessionMiddleware({
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieSecureFlag: constants.COOKIE_SECURE_ONLY !== "false",
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION)
}, sessionStore, true);
