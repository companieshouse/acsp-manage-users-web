import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import * as constants from "../lib/constants";
import { sessionStore } from "./session.middleware";

export const csrfProtectionMiddleware = CsrfProtectionMiddleware({
    sessionStore,
    enabled: true,
    sessionCookieName: constants.COOKIE_NAME
});
