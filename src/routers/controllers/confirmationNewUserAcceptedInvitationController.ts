import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { BaseViewData } from "../../types/utilTypes";
import { getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { acspLogger } from "../../lib/helpers/acspLogger";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

interface ConfirmationNewUserAcceptedInvitation extends BaseViewData {
    companyName: string;
    userRole: UserRole;
    buttonHref: string;
}

export const confirmationNewUserAcceptedInvitationControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE);
    const { acspName, userRole } = getLoggedUserAcspMembership(req.session);
    const viewData: ConfirmationNewUserAcceptedInvitation = {
        companyName: acspName,
        lang: translations,
        templateName: constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE,
        userRole,
        buttonHref: constants.LANDING_URL
    };

    acspLogger(req.session, confirmationNewUserAcceptedInvitationControllerGet.name, `Rendering ${constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE}`);

    res.render(constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE, viewData);
};
