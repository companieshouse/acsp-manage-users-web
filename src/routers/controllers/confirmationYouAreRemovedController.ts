import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const removeYourselfControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CONFIRMATION_YOU_ARE_REMOVED, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.CONFIRMATION_YOU_ARE_REMOVED);
    const removedUserDetails: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    return {
        lang: translations,
        companyName: loggedUserAcspMembership.acspName,
        userDetails: removedUserDetails.displayNameOrEmail,
        buttonHref: constants.CHS_SEARCH_REGISTER_PAGE,
        templateName: constants.CONFIRMATION_YOU_ARE_REMOVED
    };
};
