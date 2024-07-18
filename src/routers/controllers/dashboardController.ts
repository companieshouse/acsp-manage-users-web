import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRole, UserStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { getLoggedInUserEmail } from "../../lib/utils/sessionUtils";

export const dashboardControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.t, constants.DASHBOARD_PAGE);
    // Hardcoded data will be replaced once relevant API calls available
    const agentNumber = "06254821";
    const agentStatus = UserStatus.ACTIVE;
    const userRole = getUserRole(getLoggedInUserEmail(req.session));
    const userRoleTag = getUserRoleTag(userRole, true);
    const companyName = "MORRIS ACCOUNTING LTD";

    res.render(constants.DASHBOARD_PAGE,
        {
            lang: translations,
            agentNumber,
            companyName,
            agentStatus,
            userRole,
            userRoleTag,
            managePeopleLink: constants.MANAGE_USER_FULL_URL,
            youHaveVerifiedSomeonesIdentityLink: constants.YOU_HAVE_VERIFIED_SOMEONES_IDENTITY_URL,
            updateAuthorisedAgentsDetailsLink: constants.UPDATE_AUTHORISED_AGENTS_DETAILS_URL,
            viewUsersLink: constants.VIEW_USERS_FULL_URL
        });
};

// Temporary function until relevant API available
const getUserRole = (userEmailAddress: string): UserRole => {
    switch (userEmailAddress) {
    case "demo@ch.gov.uk":
        return UserRole.OWNER;
    case "demo2@ch.gov.uk":
        return UserRole.ADMIN;
    default:
        return UserRole.STANDARD;
    }
};
