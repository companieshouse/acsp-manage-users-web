import { NextFunction, Request, Response } from "express";
import * as constants from "../../lib/constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";

export const userAddedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");

    logger.debug(`userAddedNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (referrer === undefined && redirectPage(referrer, constants.CONFIRMATION_MEMBER_ADDED_FULL_URL, constants.CONFIRMATION_MEMBER_ADDED_FULL_URL)) {
        res.redirect(constants.MANAGE_USER_FULL_URL);
    } else {
        next();
    }
};
