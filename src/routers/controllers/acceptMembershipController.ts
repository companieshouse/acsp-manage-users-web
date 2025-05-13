import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import {
    UserStatus, Update, AcspMembership
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getLoggedUserAcspMembership, setExtraData } from "../../lib/utils/sessionUtils";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getMembershipForLoggedInUser, updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import { addErrorToViewData } from "../../lib/utils/viewUtils";
import { acspLogger } from "../../lib/helpers/acspLogger";

export const acceptMembershipControllerGet = async (req: Request, res: Response): Promise<void> => {
    acspLogger(req.session, acceptMembershipControllerGet.name, "Rendering accept membership page");
    const translations = getTranslationsForView(req.lang, constants.ACCEPT_MEMBERSHIP_PAGE);
    const membership = getLoggedUserAcspMembership(req.session);
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
        await handleMembershipAcceptance(req, res, UserStatus.ACTIVE, "/authorised-agent/invite-confirmation", "Yes has been selected");
        return;
    }

    if (acceptMembership === "no") {
        await handleMembershipAcceptance(req, res, UserStatus.REMOVED, "/authorised-agent/sign-out", "No selected");
        return;
    }

    acspLogger(req.session, acceptMembershipControllerPost.name, "Re-rendering page, no option selected");

    const translations = getTranslationsForView(req.lang, constants.ACCEPT_MEMBERSHIP_PAGE);
    const membership = getLoggedUserAcspMembership(req.session);
    const viewData = {
        lang: translations,
        templateName: constants.ACCEPT_MEMBERSHIP_PAGE,
        companyName: membership?.acspName || ""
    };
    addErrorToViewData("acceptMembership", constants.ERRORS_SELECT_AN_OPTION, viewData);
    return res.render(constants.ACCEPT_MEMBERSHIP_PAGE, viewData);

};

async function handleMembershipAcceptance (
    req: Request,
    res: Response,
    userStatus: UserStatus,
    redirectUrl: string,
    logMessage: string
): Promise<void> {
    acspLogger(req.session, acceptMembershipControllerPost.name, logMessage);

    const membership: AcspMembership | undefined = getLoggedUserAcspMembership(req.session);
    if (!membership) {
        const errorMessage = "Membership not found in session.";
        acspLogger(req.session, acceptMembershipControllerPost.name, errorMessage);
        throw new Error(errorMessage);
    }

    const userRoleToUpdate: Update = {
        updateUser: { userStatus }
    };

    acspLogger(req.session, acceptMembershipControllerPost.name, `Patching ACSP membership to ${userStatus}...`);
    await updateOrRemoveUserAcspMembership(req, membership.id, userRoleToUpdate);

    acspLogger(req.session, acceptMembershipControllerPost.name, "Fetching updated membership and saving to session...");
    const updatedMembership = (await getMembershipForLoggedInUser(req)).items[0];
    setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, updatedMembership);

    acspLogger(req.session, acceptMembershipControllerPost.name, `Redirecting to ${redirectUrl}`);
    res.redirect(redirectUrl);
}
