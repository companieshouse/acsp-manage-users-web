import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord, BaseViewData } from "../../types/utilTypes";
import { Lang } from "../../types/language";

interface SomethingWentWrongViewData extends BaseViewData {
    title: string;
    csrfErrors: boolean;
}

export const somethingWentWrongController = async (req: Request, res: Response): Promise<void> => {
    const lang = getTranslationsForView(req.lang || Lang.EN, constants.SOMETHING_WENT_WRONG_PAGE);
    const csrfError = isCsrfError(req);
    const viewData: SomethingWentWrongViewData = {
        title: getTitle(lang),
        csrfErrors: csrfError,
        lang,
        templateName: constants.SOMETHING_WENT_WRONG_PAGE
    };
    const statusCode: number = csrfError ? 403 : req.statusCode ?? 500;

    res.status(statusCode).render(constants.SOMETHING_WENT_WRONG_PAGE, viewData);
};

const getTitle = (translations: AnyRecord): string =>
    `${translations.sorry_something_went_wrong}${translations.title_end}`;

const isCsrfError = (req: Request): boolean => Object.hasOwn(req.query, constants.CSRF_ERRORS);
