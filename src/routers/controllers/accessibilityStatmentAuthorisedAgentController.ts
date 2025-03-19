import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";

export const accessibilityStatementAuthorisedAgentControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.ACCESSIBILITY_STATEMENT_PAGE);
    const viewData = {
        lang: translations,
        templateName: constants.ACCESSIBILITY_STATEMENT_PAGE
    };

    res.render(constants.ACCESSIBILITY_STATEMENT_PAGE, viewData);
};
