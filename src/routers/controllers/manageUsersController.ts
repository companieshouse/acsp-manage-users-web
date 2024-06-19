import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.t, constants.MANAGE_USERS_PAGE);
    res.render(constants.MANAGE_USERS_PAGE, { lang: translations });
};
