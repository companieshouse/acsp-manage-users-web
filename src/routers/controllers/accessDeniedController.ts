import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { BaseViewData } from "../../types/utilTypes";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getLoggedInUserEmail } from "../../lib/utils/sessionUtils";
import { Lang } from "../../types/language";
import logger from "../../lib/Logger";

interface AccessDeniedViewData extends BaseViewData {
    userEmailAddress: string;
    langVersion: string;
}

export const accessDeniedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const langVersion = req.lang ?? Lang.EN;
    const viewData: AccessDeniedViewData = {
        lang: getTranslationsForView(langVersion, constants.ACCESS_DENIED_PAGE),
        templateName: constants.ACCESS_DENIED_PAGE,
        userEmailAddress: getLoggedInUserEmail(req.session),
        langVersion
    };
    logger.info(`${accessDeniedControllerGet.name} Rendering access denied page`);
    res.render(constants.ACCESS_DENIED_PAGE, viewData);
};
