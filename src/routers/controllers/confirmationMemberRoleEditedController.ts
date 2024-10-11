import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRoleChangeData, ViewData } from "../../types/utilTypes";
import {
    deleteExtraData,
    getExtraData,
    getLoggedUserAcspMembership
} from "../../lib/utils/sessionUtils";

export const confirmationMemberRoleEditedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);
    res.render(constants.CONFIRMATION_MEMBER_ROLE_EDITED_PAGE, viewData);
};

const getViewData = async (req: Request): Promise<ViewData> => {
    const translations = getTranslationsForView(req.lang, constants.CONFIRMATION_MEMBER_ROLE_EDITED_PAGE);
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const { acspName } = getLoggedUserAcspMembership(req.session);

    const viewData: ViewData = {
        lang: translations,
        templateName: constants.CONFIRMATION_MEMBER_ROLE_EDITED_PAGE,
        companyName: acspName,
        email: userRoleChangeData.userEmail,
        userDisplayName: userRoleChangeData.userDisplayName,
        userRole: userRoleChangeData.userRole,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL
    };

    deleteExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);

    return viewData;
};
