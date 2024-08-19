import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { AnyRecord } from "../../types/utilTypes";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { NewUserDetails } from "../../types/user";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const checkMemberDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CHECK_MEMBER_DETAILS_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.CHECK_MEMBER_DETAILS_PAGE);
    const newUserDetails: NewUserDetails = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);
    const userRoleTag = getUserRoleTag(newUserDetails.userRole as UserRole, false);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const companyName = loggedInUserMembership.acspName;

    return {
        lang: translations,
        companyName,
        userEmailAddress: newUserDetails.email,
        userRole: newUserDetails.userRole,
        userRoleTag,
        backLinkUrl: constants.ADD_USER_FULL_URL,
        tryAddingUserUrl: constants.TRY_ADDING_USER_FULL_URL,
        templateName: constants.CHECK_MEMBER_DETAILS_PAGE
    };
};
