import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { MemberForRemoval } from "../../types/membership";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const removeUserSuccessControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.USER_REMOVE_CONFIRMATION_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView((req as any).lang, constants.USER_REMOVE_CONFIRMATION_PAGE);
    const removedMember: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    return {
        lang: translations,
        companyName: loggedUserAcspMembership.acspName,
        userDetails: removedMember.displayNameOrEmail,
        buttonHref: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.USER_REMOVE_CONFIRMATION_PAGE
    };
};
