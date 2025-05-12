import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { BaseViewData } from "../../types/utilTypes";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface InvitationConfirmGetViewData extends BaseViewData {
    companyName: string,
    buttonHref: string
}

export const invitationConfirmationControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.INVITATION_CONFIRMATION_PAGE);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const companyName = loggedInUserMembership.acspName;

    const viewData: InvitationConfirmGetViewData = {
        lang: translations,
        templateName: constants.CANNOT_ADD_USER,
        buttonHref: constants.MANAGE_USERS_FULL_URL,
        companyName: companyName
    };
    acspLogger(req.session, invitationConfirmationControllerGet.name, `Rendering invitation confirmation screen`);
    res.render(constants.INVITATION_CONFIRMATION_PAGE, viewData);
};
