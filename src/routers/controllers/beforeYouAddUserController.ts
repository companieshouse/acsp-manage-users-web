import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface BeforeYouAddUserGetViewData extends ViewDataWithBackLink {
    buttonHref: string;
    linkHref: string;
}

/**
 * Controller for the "Before you add user" page.
 * This page is displayed at the beginning of the Add user journey.
 * It provides information that a new user must have a Companies House account
 * and allows to proceed with adding the user.
 *
 * @param req - The request object
 * @param res - The response object
 */
export const beforeYouAddUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.BEFORE_YOU_ADD_USER_PAGE);
    const viewData: BeforeYouAddUserGetViewData = {
        buttonHref: constants.ADD_USER_FULL_URL,
        lang: translations,
        linkHref: constants.SIGN_IN_URL,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.BEFORE_YOU_ADD_USER_PAGE
    };

    acspLogger(req.session, beforeYouAddUserControllerGet.name, `rendering 'Before you add user' page`);
    res.render(constants.BEFORE_YOU_ADD_USER_PAGE, viewData);
};
