import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRoleChangeData, ViewDataWithBackLink } from "../../types/utilTypes";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface ConfirmationMemberRoleEditedGetViewData extends ViewDataWithBackLink {
    companyName: string,
    email: string,
    userDisplayName: string | undefined,
    userRole: string,
}

export const confirmationMemberRoleEditedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CONFIRMATION_MEMBER_ROLE_EDITED_PAGE);
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const { acspName } = getLoggedUserAcspMembership(req.session);

    const viewData: ConfirmationMemberRoleEditedGetViewData = {
        lang: translations,
        templateName: constants.CONFIRMATION_MEMBER_ROLE_EDITED_PAGE,
        companyName: acspName,
        email: userRoleChangeData.userEmail,
        userDisplayName: userRoleChangeData.userDisplayName,
        userRole: userRoleChangeData.userRole,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL
    };
    acspLogger(req.session, `${confirmationMemberRoleEditedControllerGet.name}: rendering confirmation member edited`);

    res.render(constants.CONFIRMATION_MEMBER_ROLE_EDITED_PAGE, viewData);
};
