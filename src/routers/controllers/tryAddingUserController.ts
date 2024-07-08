import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import logger from "../../lib/Logger";
import { Error } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const tryAddingUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    try {
        // call to relevant API once available and if successful
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        const error = err as Error;
        logger.debug(`${tryAddingUserControllerGet.name}: request to add a user to ACSP returned an error: ${error.error}`);

        // Placeholder error message
        if (error.error === constants.MEMBER_ALREADY_ADDED_ERROR) {
            res.redirect(constants.MEMBER_ALREADY_ADDED_FULL_URL);
        } else {
            throw err;
        }

    }
};
