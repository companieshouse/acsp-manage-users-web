import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { BaseViewData } from "../../types/utilTypes";

interface RemoveYourselfGetViewData extends BaseViewData {
    companyName: string,
    userDetails: string,
    buttonHref:string,
}

export const removeYourselfControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CONFIRMATION_YOU_ARE_REMOVED_PAGE);
    const removedUserDetails: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    const viewData: RemoveYourselfGetViewData = {
        lang: translations,
        buttonHref: constants.CHS_SEARCH_REGISTER_PAGE,
        templateName: constants.CONFIRMATION_YOU_ARE_REMOVED_PAGE,
        companyName: loggedUserAcspMembership.acspName,
        userDetails: removedUserDetails.displayNameOrEmail
    };

    res.render(constants.CONFIRMATION_YOU_ARE_REMOVED_PAGE, viewData);
};
