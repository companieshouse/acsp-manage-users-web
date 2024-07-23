import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import logger from "../../lib/Logger";
import { Error, Errors, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData, getLoggedInUserEmail } from "../../lib/utils/sessionUtils";
import { Membership } from "../../types/membership";
import { membership } from "./manageUsersController";
import { Session } from "@companieshouse/node-session-handler";

export const tryRemovingUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    try {
        const memberDetails: Membership = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
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

        if (isRemovingThemselvesAsOnlyAccHolder(memberDetails, req.session as Session)) {
            res.redirect("/authorised-agent/stop-page");
        }
        // for testing purposes
        const index = membership.findIndex(element => memberDetails.id === element.id);
        if (index >= 0) { membership.splice(index, 1); }

        // if call to relevant API successful
        res.redirect(constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL);
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

export const isRemovingThemselvesAsOnlyAccHolder = (memberDetails: Membership, session: Session): boolean => {
    // check if removing themselves and they are the only account holder
    const owners = membership.filter(mem => mem.userRole === UserRole.OWNER);
    const onlyAccHolder = memberDetails.userRole === UserRole.OWNER && owners.length === 1;
    const removingThemselves = getLoggedInUserEmail(session) === memberDetails.userEmail;
    return onlyAccHolder && removingThemselves;
};
