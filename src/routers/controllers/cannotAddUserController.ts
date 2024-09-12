import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import logger from "../../lib/Logger";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const cannotAddUserController = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView((req as any).lang, constants.CANNOT_ADD_USER);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const { acspName } = loggedInUserMembership ?? {};

    logger.debug(`${cannotAddUserController.name}: Rendering cannot add user screen`);
    res.render(constants.CANNOT_ADD_USER, {
        serviceName: translations.service_name,
        title: translations.cannot_add_user_title,
        backLinkUrl: constants.CHECK_MEMBER_DETAILS_FULL_URL,
        manageUsersLinkText: `${translations.manage_users_link_text} ${acspName}.`,
        manageUsersLinkHref: constants.MANAGE_USERS_FULL_URL,
        lang: translations,
        templateName: constants.CANNOT_ADD_USER
    });
};
