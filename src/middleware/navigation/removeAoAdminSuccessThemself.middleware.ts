import { NextFunction, Request, Response } from "express";
import * as constants from "../../lib/constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";

export const removeAoAdminSuccessThemselfNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");

    logger.debug(`removeAoAdminSuccessThemselfNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (referrer === undefined && redirectPage(referrer, constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL, constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
