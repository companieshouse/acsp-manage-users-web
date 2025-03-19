import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { MemberForRemoval } from "../../types/membership";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { BaseViewData } from "../../types/utilTypes";
import logger from "../../lib/Logger";

interface RemoveUserSuccessGet extends BaseViewData {
    companyName: string,
    userDetails: string,
    buttonHref: string,
}

export const removeUserSuccessControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.USER_REMOVE_CONFIRMATION_PAGE);
    const removedMember: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    const viewData: RemoveUserSuccessGet = {
        lang: translations,
        companyName: loggedUserAcspMembership.acspName,
        userDetails: removedMember.displayNameOrEmail,
        buttonHref: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.USER_REMOVE_CONFIRMATION_PAGE
    };
    logger.info(`${removeUserSuccessControllerGet.name}: rendering confirmation member removed`);

    res.render(constants.USER_REMOVE_CONFIRMATION_PAGE, viewData);
};
