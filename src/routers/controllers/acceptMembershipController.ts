import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import {
    UserStatus, Update
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import logger from "../../lib/Logger";
import { addErrorToViewData } from "../../lib/utils/viewUtils";

export const acceptMembershipControllerGet = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.lang, constants.ACCEPT_MEMBERSHIP_PAGE);
    const membership = getLoggedUserAcspMembership(req.session);
    console.log("###### acceptMembershipControllerGet ######", membership);
    const viewData = {
        lang: translations,
        templateName: constants.ACCEPT_MEMBERSHIP_PAGE,
        companyName: membership?.acspName || ""
    };

    res.render(constants.ACCEPT_MEMBERSHIP_PAGE, viewData);
};

export const acceptMembershipControllerPost = async (req: Request, res: Response): Promise<void> => {

    const { acceptMembership } = req.body;
    if (!acceptMembership) {
        const translations = getTranslationsForView(req.lang, constants.ACCEPT_MEMBERSHIP_PAGE);
        const membership = getLoggedUserAcspMembership(req.session);
        const viewData = {
            lang: translations,
            templateName: constants.ACCEPT_MEMBERSHIP_PAGE,
            companyName: membership?.acspName || ""
        };
        addErrorToViewData("acceptMembership", constants.ERRORS_SELECT_AN_OPTION, viewData);
        return res.render(constants.ACCEPT_MEMBERSHIP_PAGE, viewData);
    } else if (acceptMembership === "yes") {
        console.log("###### acceptMembershipControllerPost  yes scenarios ######");
        const acspMembershipId = getExtraData(req.session, "pendingMembershipId");
        // check if undefined
        logger.info("patching membership id from pending to approved " + acspMembershipId);
        const userRoleToUpdate: Update = {
            updateUser: {
                userStatus: UserStatus.ACTIVE
            }
        };
        await updateOrRemoveUserAcspMembership(req, acspMembershipId, userRoleToUpdate);
        res.redirect("authorised-agent/invite-confirmation");
    } else if (acceptMembership === "no") {
        console.log("###### acceptMembershipControllerPost no scenarios ######");
        const acspMembershipId = getExtraData(req.session, "pendingMembershipId");
        // check if undefined
        logger.info("patching membership id from pending to removed " + acspMembershipId);
        const userRoleToUpdate: Update = {
            updateUser: {
                userStatus: UserStatus.REMOVED
            }
        };
        await updateOrRemoveUserAcspMembership(req, acspMembershipId, userRoleToUpdate);

        res.redirect("authorised-agent/sign-out");
    }
};
