import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { NewUserDetails } from "../../types/user";
import { getUserRoleTag } from "../../lib/utils/viewUtils";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const confirmationMemberAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CONFIRMATION_MEMBER_ADDED_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView((req as any).lang, constants.CONFIRMATION_MEMBER_ADDED_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    const newUserDetails: NewUserDetails = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);
    const userRole = getUserRoleTag(newUserDetails.userRole as UserRole, (req as any).lang, true);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const companyName = loggedInUserMembership.acspName;

    return {
        lang: translations,
        newUserDetails,
        userRole,
        companyName,
        buttonHref: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.CONFIRMATION_MEMBER_ADDED_PAGE
    };
};
