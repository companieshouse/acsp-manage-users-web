import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRole, UserStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRoleTag } from "../../lib/utils/viewUtils";

export const dashboardControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.t, constants.DASHBOARD_PAGE);
    // Hardcoded data will be replaced once relevant API calls available
    const agentNumber = "06254821";
    const agentStatus = UserStatus.ACTIVE;
    const userRoleTag = getUserRoleTag(UserRole.OWNER, true);
    const companyName = "MORRIS ACCOUNTING LTD";

    res.render(constants.DASHBOARD_PAGE,
        {
            lang: translations,
            agentNumber,
            companyName,
            agentStatus,
            userRoleTag,
            managePeopleLink: constants.MANAGE_USER_FULL_URL,
            youHaveVerifiedSomeonesIdentityLink: constants.YOU_HAVE_VERIFIED_SOMEONES_IDENTITY_URL,
            updateAuthorisedAgentsDetailsLink: constants.UPDATE_AUTHORISED_AGENTS_DETAILS_URL
        });
};
