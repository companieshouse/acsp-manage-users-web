import mockAuthenticationMiddleware from "./authentication.middleware.mock";
import mockLoggedUserAcspMembershipMiddleware from "./loggedUserAcspMembershipMiddleware.middleware.mock";
import { mockSessionMiddleware, mockEnsureSessionCookiePresentMiddleware } from "./session.middleware.mock";
import mockNavigationMiddleware from "./navigationMiddleware.middleware.mock";
import mockAcspAuthMiddleware from "./acsp.authentication.mock";
import mockCsrfProtectionMiddleware from "./csrf.protection.middleware.mock";

export default {
    mockAuthenticationMiddleware,
    mockSessionMiddleware,
    mockEnsureSessionCookiePresentMiddleware,
    mockLoggedUserAcspMembershipMiddleware,
    mockNavigationMiddleware,
    mockAcspAuthMiddleware,
    mockCsrfProtectionMiddleware
};
