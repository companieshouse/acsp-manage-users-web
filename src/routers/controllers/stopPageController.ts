import { Request, RequestHandler, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";

export const stopPageController: RequestHandler = async (req: Request, res: Response) => {

    const lang = getTranslationsForView(req.lang || "en", constants.SERVICE_UNAVAILABLE);

    const getTitle = (translations: AnyRecord): string =>
        `${translations.sorry_something_went_wrong}${translations.title_end}`;

    res.status(403).render(constants.SERVICE_UNAVAILABLE_TEMPLATE, {
        lang: getTranslationsForView(req.lang || "en", constants.SERVICE_UNAVAILABLE),
        csrfErrors: true,
        title: getTitle(lang),
        templateName: constants.SERVICE_UNAVAILABLE_TEMPLATE
    });
};
