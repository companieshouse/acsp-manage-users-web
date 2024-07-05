import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";

export const addUserControllerGet = async (req: Request, res: Response): Promise<void> => {

    const viewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL
    };
    res.render(constants.ADD_USER_PAGE, viewData);
};
