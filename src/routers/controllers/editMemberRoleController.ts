import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { ViewData } from "../../types/utilTypes";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { Membership } from "../../types/membership";

export const editMemberRoleControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);
    res.render(constants.EDIT_MEMBER_ROLE_PAGE, viewData);
};

const getViewData = async (req: Request): Promise<ViewData> => {
    const translations = getTranslationsForView(req.lang, constants.EDIT_MEMBER_ROLE_PAGE);
    const { acspName, userRole } = getLoggedUserAcspMembership(req.session);
    const id = req.params.id;
    const existingUsers = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const userToChangeRole: Membership = existingUsers.find((member: Membership) => member.id === id);

    const viewData: ViewData = {
        lang: translations,
        loggedInUserRole: userRole,
        companyName: acspName,
        email: userToChangeRole.userEmail,
        userRole: userToChangeRole.userRole,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.EDIT_MEMBER_ROLE_PAGE,
        verifyPeopleIdentityFromDate: "XX DATE", // TODO - replace with live data once known
        fileAsAuthorisedAgentFromDate: "XX DATE" // TODO - replace with live data once known
    };

    return viewData;
};
