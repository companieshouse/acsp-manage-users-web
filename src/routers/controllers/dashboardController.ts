import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";

export const dashboardControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.t, constants.DASHBOARD_PAGE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    const agentNumber = loggedUserAcspMembership.acspNumber;
    const agentStatus = loggedUserAcspMembership.acspStatus;
    const userRole = loggedUserAcspMembership.userRole;
    const userRoleTag = getUserRoleTag(userRole, true);
    const companyName = loggedUserAcspMembership.acspName;

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
