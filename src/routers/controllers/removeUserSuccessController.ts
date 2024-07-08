import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";

export const removeUserSuccessControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.USER_REMOVE_CONFIRMATION_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.USER_REMOVE_CONFIRMATION_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    const companyName = "MORRIS ACCOUNTING LTD";
    const userEmail = "d.jones@example.com";
    const userName = "Davy Jones";

    return {
        lang: translations,
        companyName,
        userEmail,
        userName,
        buttonHref: constants.MANAGE_USER_FULL_URL
    };
};
