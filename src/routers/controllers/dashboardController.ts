import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { BaseViewData } from "../../types/utilTypes";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface DashboardGetViewData extends BaseViewData {
    agentNumber: string,
    companyName: string,
    agentStatus: string,
    userRole: UserRole,
    userRoleTag: string,
    managePeopleLink: string,
    youHaveVerifiedSomeonesIdentityLink: string,
    updateAuthorisedAgentsDetailsLink: string,
    closeAuthorisedAgentAccountLink: string,
    viewUsersLink: string
}

export const dashboardControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.DASHBOARD_PAGE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    if (loggedUserAcspMembership) {
        res.locals.displayAuthorisedAgent = "yes";
    }

    const viewData: DashboardGetViewData = {
        lang: translations,
        templateName: constants.DASHBOARD_PAGE,
        managePeopleLink: constants.MANAGE_USERS_FULL_URL,
        youHaveVerifiedSomeonesIdentityLink: constants.YOU_HAVE_VERIFIED_SOMEONES_IDENTITY_URL,
        updateAuthorisedAgentsDetailsLink: `${constants.UPDATE_AUTHORISED_AGENTS_DETAILS_URL}?lang=${req.lang}`,
        closeAuthorisedAgentAccountLink: `${constants.CLOSE_AUTHORISED_AGENT_ACCOUNT_URL}?lang=${req.lang}`,
        viewUsersLink: constants.VIEW_USERS_FULL_URL,
        agentNumber: loggedUserAcspMembership.acspNumber,
        companyName: loggedUserAcspMembership.acspName,
        agentStatus: loggedUserAcspMembership.acspStatus,
        userRole: loggedUserAcspMembership.userRole,
        userRoleTag: getUserRoleTag(loggedUserAcspMembership.userRole, req.lang, true)
    };
    acspLogger(req.session, dashboardControllerGet.name, `rendering dashboard page`);
    res.render(constants.DASHBOARD_PAGE, viewData);
};
