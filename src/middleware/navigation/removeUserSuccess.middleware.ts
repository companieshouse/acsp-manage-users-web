import { NextFunction, Request, Response } from "express";
import * as constants from "../../lib/constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";

export const removeUserSuccessNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");

    logger.debug(`removeUserSuccessNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (referrer === undefined && redirectPage(referrer, constants.USER_REMOVE_CONFIRMATION_PAGE, constants.USER_REMOVE_CONFIRMATION_PAGE)) {
        res.redirect(constants.MANAGE_USER_FULL_URL);
    } else {
        next();
    }
};
