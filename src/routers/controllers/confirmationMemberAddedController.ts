import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { BaseViewData } from "../../types/utilTypes";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { NewUserDetails } from "../../types/user";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface ConfirmationMemberAddedGetViewData extends BaseViewData {
    newUserDetails: NewUserDetails,
    userRole: string,
    companyName: string,
    buttonHref: string
}

export const confirmationMemberAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CONFIRMATION_MEMBER_ADDED_PAGE);

    const newUserDetails: NewUserDetails = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);
    const userRole = getUserRoleTag(newUserDetails.userRole as UserRole, req.lang, true);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const companyName = loggedInUserMembership.acspName;

    const viewData: ConfirmationMemberAddedGetViewData = {
        lang: translations,
        buttonHref: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.CONFIRMATION_MEMBER_ADDED_PAGE,
        newUserDetails,
        userRole,
        companyName
    };
    acspLogger(req.session, confirmationMemberAddedControllerGet.name, ` rendering confirmation member added`);

    res.render(constants.CONFIRMATION_MEMBER_ADDED_PAGE, viewData);
};
