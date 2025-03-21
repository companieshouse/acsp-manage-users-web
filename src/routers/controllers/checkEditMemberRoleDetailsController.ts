import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRoleChangeData, ViewDataWithBackLink } from "../../types/utilTypes";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface CheckEditMemberRoleDetailsGetViewData extends ViewDataWithBackLink {
    companyName: string,
    email: string,
    userDisplayName: string | undefined,
    userRole: string,
    userRoleTag: string
    tryEditUserRoleUrl: string
}

export const checkEditMemberRoleDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE);
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const userRoleTag = getUserRoleTag(userRoleChangeData.userRole as UserRole, req.lang, false);
    const { acspName } = getLoggedUserAcspMembership(req.session);

    const viewData: CheckEditMemberRoleDetailsGetViewData = {
        lang: translations,
        templateName: constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE,
        companyName: acspName,
        email: userRoleChangeData.userEmail,
        userDisplayName: userRoleChangeData.userDisplayName,
        userRole: userRoleChangeData.userRole,
        userRoleTag,
        backLinkUrl: userRoleChangeData.changeRolePageUrl,
        tryEditUserRoleUrl: constants.TRY_EDIT_MEMBER_ROLE_FULL_URL
    };
    acspLogger(req.session, checkEditMemberRoleDetailsControllerGet.name, `Rendering ${constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE}`);
    res.render(constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE, viewData);
};
