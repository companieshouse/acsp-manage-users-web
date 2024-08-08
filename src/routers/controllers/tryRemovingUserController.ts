import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import logger from "../../lib/Logger";
import { Error, Errors } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";

export const tryRemovingUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    try {
        const memberDetails: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
        // call to relevant API once available
        // but temporarily for testing purposes
        if (memberDetails.userEmail === "j.smith@test.com") {
            const error: Errors = {
                errors: [
                    {
                        error: constants.MEMBER_ALREADY_REMOVED_ERROR
                    } as Error
                ]
            };
            throw error;
        }

        // Redirect the user to a stop page when the try to remove themselves when
        // they are the only account holder - isRemovingThemselvesAsOnlyAccHolder previously
        // handled this

        // if call to relevant API successful
        if (memberDetails.removingThemselves) {
            res.redirect(constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL);
        } else {
            res.redirect(constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL);
        }
    } catch (err: unknown) {
        const error = err as Errors;
        logger.debug(`${tryRemovingUserControllerGet.name}: request to remove a user from ACSP returned an error: ${error.errors[0].error}`);

        // Placeholder error message
        if (error.errors[0].error === constants.MEMBER_ALREADY_REMOVED_ERROR) {
            res.redirect(constants.MEMBER_ALREADY_REMOVED_FULL_URL);
        } else {
            throw err;
        }

    }
};
