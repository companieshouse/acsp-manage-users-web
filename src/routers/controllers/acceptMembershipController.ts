import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import {
    UserStatus, Update,
    AcspMembers,
    AcspMembership
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData, getLoggedUserAcspMembership, setExtraData } from "../../lib/utils/sessionUtils";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getMembershipForLoggedInUser, updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
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
    if (acceptMembership === "yes") {
        console.log("###### acceptMembershipControllerPost  yes scenarios ######");
        const membership: AcspMembership | undefined = getLoggedUserAcspMembership(req.session);

        // check if undefined
        logger.info("patching membership id from pending to approved " + membership.id);
        const userRoleToUpdate: Update = {
            updateUser: {
                userStatus: UserStatus.ACTIVE
            }
        };
        await updateOrRemoveUserAcspMembership(req, membership.id, userRoleToUpdate);
        const acspMembership = (await getMembershipForLoggedInUser(req)).items[0];
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, acspMembership);
        res.redirect("authorised-agent/invite-confirmation");
    } else if (acceptMembership === "no") {
        console.log("###### acceptMembershipControllerPost no scenarios ######");
        const membership: AcspMembership | undefined = getLoggedUserAcspMembership(req.session);
        // check if undefined
        logger.info("patching membership id from pending to removed " + membership.id);
        const userRoleToUpdate: Update = {
            updateUser: {
                userStatus: UserStatus.REMOVED
            }
        };
        await updateOrRemoveUserAcspMembership(req, membership.id, userRoleToUpdate);
        const acspMembership = (await getMembershipForLoggedInUser(req)).items[0];
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, acspMembership);

        res.redirect("/authorised-agent/sign-out");
    } else {
        const translations = getTranslationsForView(req.lang, constants.ACCEPT_MEMBERSHIP_PAGE);
        const membership = getLoggedUserAcspMembership(req.session);
        const viewData = {
            lang: translations,
            templateName: constants.ACCEPT_MEMBERSHIP_PAGE,
            companyName: membership?.acspName || ""
        };
        addErrorToViewData("acceptMembership", constants.ERRORS_SELECT_AN_OPTION, viewData);
        return res.render(constants.ACCEPT_MEMBERSHIP_PAGE, viewData);
    }
};
