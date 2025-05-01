import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import {
    UserStatus, Update
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import logger from "../../lib/Logger";

export const acceptMembershipControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.ACCEPT_MEMBERSHIP_PAGE);
    const viewData = {
        lang: translations,
        templateName: constants.ACCEPT_MEMBERSHIP_PAGE
    };

    res.render(constants.ACCEPT_MEMBERSHIP_PAGE, viewData);
};

export const acceptMembershipControllerPost = async (req: Request, res: Response): Promise<void> => {
    console.log("###### acceptMembershipControllerPost ######");
    const acspMembershipId = getExtraData(req.session, "pendingMembershipId");
    // check if undefined
    logger.info("patching membership id from pending to approved " + acspMembershipId);
    const userRoleToUpdate: Update = {
        updateUser: {
            userStatus: UserStatus.APPROVED
        }
    };
    await updateOrRemoveUserAcspMembership(req, acspMembershipId, userRoleToUpdate);
    res.redirect("authorised-agent/invite-confirmation");
};
