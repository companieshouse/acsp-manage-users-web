import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import logger from "../../lib/Logger";
import {
    AcspMembership,
    UserRole
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../types/user";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { createAcspMembership } from "../../services/acspMemberService";
import { getUserDetails } from "../../services/userAccountService";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";
import { User } from "private-api-sdk-node/dist/services/user-account/types";

export const tryAddingUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.t, constants.TRY_ADDING_USER);

    const newUserDetails: NewUserDetails | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const { acspNumber, acspName } = loggedInUserMembership ?? {};
    if (!acspNumber || !acspName) {
        logger.error(`${tryAddingUserControllerPost.name}: Unable to retrieve ACSP number or name for the logged-in user`);
        _renderStopScreen(res, translations, acspName);
        return;
    }

    if (!newUserDetails?.email) {
        logger.error(`${tryAddingUserControllerPost.name}: New user details or email not found in session`);
        throw new Error(`New user details or email not found in session`);
    }

    const userBeingAdded: User[] = await getUserDetails(newUserDetails.email);
    if (!userBeingAdded || userBeingAdded.length === 0) {
        logger.error(`${tryAddingUserControllerPost.name}: User not found. Email: ${newUserDetails.email}`);
        _renderStopScreen(res, translations, acspName);
        return;
    }

    const firstUser = userBeingAdded[0] as User;
    try {
        await createAcspMembership(req, acspNumber, firstUser.userId as string, newUserDetails.userRole as UserRole);
        logger.info(`${tryAddingUserControllerPost.name}: Successfully added user ${firstUser.userId} to ACSP ${acspNumber}`);
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        logger.error(`${tryAddingUserControllerPost.name}: Error adding user to ACSP: ${err}`);
        _renderStopScreen(res, translations, acspName);
    }
};

function _renderStopScreen (res: Response, translations: AnyRecord, acspName: string): void {
    logger.debug(`${_renderStopScreen.name}: Rendering cannot add user screen`);
    res.render(constants.CANNOT_ADD_USER, {
        serviceName: translations.service_name,
        title: translations.cannot_add_user_title,
        backLinkUrl: constants.CHECK_MEMBER_DETAILS_FULL_URL,
        manageUsersLinkText: `${translations.manage_users_link_text} ${acspName}.`,
        manageUsersLinkHref: constants.MANAGE_USER_FULL_URL,
        lang: translations,
        templateName: constants.CANNOT_ADD_USER
    });
}
