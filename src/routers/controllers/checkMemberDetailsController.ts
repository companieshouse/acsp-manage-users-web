import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { NewUserDetails } from "../../types/user";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface CheckMemberDetailsGetViewData extends ViewDataWithBackLink {
    companyName: string,
    newUserEmailAddress: string,
    userRole: UserRole,
    userRoleTag: string,
    tryAddingUserUrl: string,
}

export const checkMemberDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CHECK_MEMBER_DETAILS_PAGE);
    const newUserDetails: NewUserDetails = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);
    const userRoleTag = getUserRoleTag(newUserDetails.userRole as UserRole, req.lang, false);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const companyName = loggedInUserMembership.acspName;

    const viewData: CheckMemberDetailsGetViewData = {
        lang: translations,
        backLinkUrl: constants.ADD_USER_FULL_URL,
        tryAddingUserUrl: constants.TRY_ADDING_USER_FULL_URL,
        templateName: constants.CHECK_MEMBER_DETAILS_PAGE,
        newUserEmailAddress: newUserDetails.email as string,
        userRole: newUserDetails.userRole as UserRole,
        companyName,
        userRoleTag
    };
    acspLogger(req.session, checkMemberDetailsControllerGet.name, `Rendering check member details page`);

    res.render(constants.CHECK_MEMBER_DETAILS_PAGE, viewData);
};
