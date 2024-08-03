import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import logger from "../../lib/Logger";
import { Error, Errors } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../types/user";
import { getExtraData } from "../../lib/utils/sessionUtils";
// import { Membership } from "../../types/membership";
// import { acspMembers } from "./manageUsersController";

export const tryAddingUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUserDetails: NewUserDetails = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);
        // call to relevant API once available
        // but temporarily for testing purposes
        if (newUserDetails.email === "j.smith@test.com") {
            const error: Errors = {
                errors: [
                    {
                        error: constants.MEMBER_ALREADY_ADDED_ERROR
                    } as Error
                ]
            };
            throw error;
        }
        // if call to relevant API successful
        // const acspMembership: Membership = {
        //     id: Date.now().toString(),
        //     userId: newUserDetails.userId || "",
        //     userEmail: newUserDetails.email || "",
        //     userDisplayName: newUserDetails.displayName || "",
        //     acspNumber: Date.now().toString(),
        //     userRole: newUserDetails.userRole || UserRole.STANDARD
        // };

        // acspMembers.push(acspMembership);
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        const error = err as Errors;
        logger.debug(`${tryAddingUserControllerGet.name}: request to add a user to ACSP returned an error: ${error.errors[0].error}`);

        // Placeholder error message
        if (error.errors[0].error === constants.MEMBER_ALREADY_ADDED_ERROR) {
            res.redirect(constants.MEMBER_ALREADY_ADDED_FULL_URL);
        } else {
            throw err;
        }

    }
};
