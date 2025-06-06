import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface CannotAddUserGetViewData extends ViewDataWithBackLink {
    acspName: string;
    manageUsersLinkHref: string;
    manageUsersLinkText: string;
    linkHref: string;
}

export const cannotAddUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CANNOT_ADD_USER);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const { acspName } = loggedInUserMembership ?? {};

    const viewData: CannotAddUserGetViewData = {
        lang: translations,
        templateName: constants.CANNOT_ADD_USER,
        backLinkUrl: constants.CHECK_MEMBER_DETAILS_FULL_URL,
        manageUsersLinkHref: constants.MANAGE_USERS_FULL_URL,
        manageUsersLinkText: `${translations.manage_users_for} ${acspName}`,
        acspName,
        linkHref: constants.SIGN_IN_URL
    };

    acspLogger(req.session, cannotAddUserControllerGet.name, `Rendering cannot add user screen`);
    res.render(constants.CANNOT_ADD_USER, viewData);
};
