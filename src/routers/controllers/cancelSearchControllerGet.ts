import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { deleteExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const cancelSearchControllerGet = async (req: Request, res: Response): Promise<void> => {
    deleteExtraData(req.session, constants.SEARCH_STRING_EMAIL);
    const { userRole } = getLoggedUserAcspMembership(req.session);

    if (userRole === UserRole.STANDARD) {
        res.redirect(constants.VIEW_USERS_FULL_URL);
    } else {
        res.redirect(constants.MANAGE_USERS_FULL_URL);
    }
};
