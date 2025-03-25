import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";

export const accessibilityStatementAuthorisedAgentControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.ACCESSIBILITY_STATEMENT_PAGE);
    const viewData = {
        lang: translations,
        templateName: constants.ACCESSIBILITY_STATEMENT_PAGE,
        urls: {
            ABILITY_NET_ADVICE_URL: constants.ABILITY_NET_ADVICE_URL,
            ACCESSIBILITY_SUPPORT_GUIDANCE_URL: constants.ACCESSIBILITY_SUPPORT_GUIDANCE_URL,
            DIGITAL_ACCESSIBILITY_CENTRE_URL: constants.DIGITAL_ACCESSIBILITY_CENTRE_URL,
            EQUALITY_ADVISOR_SERVICE_URL: constants.EQUALITY_ADVISOR_SERVICE_URL,
            GOV_ACCESSIBILITY_URL: constants.GOV_ACCESSIBILITY_URL,
            USABILITY_BLOG_URL: constants.USABILITY_BLOG_URL,
            USER_PANEL_URL: constants.USER_PANEL_URL,
            WCAG_URL: constants.WCAG_URL
        }
    };

    res.render(constants.ACCESSIBILITY_STATEMENT_PAGE, viewData);
};
