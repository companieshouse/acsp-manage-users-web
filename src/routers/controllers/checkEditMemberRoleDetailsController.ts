import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRoleChangeData, ViewData } from "../../types/utilTypes";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const checkEditMemberRoleDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE, viewData);
};

const getViewData = (req: Request): ViewData => {
    const translations = getTranslationsForView(req.lang, constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE);
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const userRoleTag = getUserRoleTag(userRoleChangeData.userRole as UserRole, req.lang, false);
    const { acspName } = getLoggedUserAcspMembership(req.session);

    return {
        lang: translations,
        templateName: constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE,
        companyName: acspName,
        email: userRoleChangeData.userEmail,
        userRole: userRoleChangeData.userRole,
        userRoleTag,
        backLinkUrl: userRoleChangeData.changeRolePageUrl,
        tryEditUserRoleUrl: constants.TRY_EDIT_MEMBER_ROLE_FULL_URL
    };
};
