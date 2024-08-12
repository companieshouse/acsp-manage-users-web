import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import {
    CANNOT_ADD_USER,
    CHECK_MEMBER_DETAILS_FULL_URL,
    CHECK_MEMBER_DETAILS_PAGE,
    TRY_ADDING_USER
} from "../../lib/constants";
import logger from "../../lib/Logger";
import { AcspMembers, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../types/user";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { createAcspMembership, getMembershipForLoggedInUser } from "../../services/acspMemberService";
import { getUserDetails } from "../../services/userAccountService";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";
import { User } from "private-api-sdk-node/dist/services/user-account/types";

export const tryAddingUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const translations = getTranslationsForView(req.t, TRY_ADDING_USER);

    const newUserDetails: NewUserDetails | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);

    const loggedInUserMembership: AcspMembers = await getMembershipForLoggedInUser(req);
    const { acspNumber, acspName } = loggedInUserMembership.items[0] ?? {};
    if (!acspNumber || !acspName) {
        logger.error(`${tryAddingUserControllerPost.name}: Unable to retrieve ACSP number or name for the logged-in user`);
        _renderStopScreen(res, translations, acspName, constants.CHECK_MEMBER_DETAILS_FULL_URL);
        return;
    }

    if (!newUserDetails?.email) {
        logger.error(`${tryAddingUserControllerPost.name}: New user details or email not found in session`);
        throw new Error(`New user details or email not found in session`);
    }

    const userBeingAdded: User[] = await getUserDetails(newUserDetails.email);
    if (!userBeingAdded || userBeingAdded.length === 0) {
        logger.error(`${tryAddingUserControllerPost.name}: User not found. Email: ${newUserDetails.email}`);
        _renderStopScreen(res, translations, acspName, constants.CHECK_MEMBER_DETAILS_FULL_URL);
        return;
    }

    const firstUser = userBeingAdded[0] as User;
    try {
        await createAcspMembership(req, acspNumber, firstUser.userId as string, newUserDetails.userRole as UserRole);
        logger.info(`${tryAddingUserControllerPost.name}: Successfully added user ${firstUser.userId} to ACSP ${acspNumber}`);
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        logger.error(`${tryAddingUserControllerPost.name}: Error adding user to ACSP: ${err}`);
        _renderStopScreen(res, translations, acspName, constants.CHECK_MEMBER_DETAILS_FULL_URL);
    }
};

function _renderStopScreen (res: Response, translations: AnyRecord, acspName: string, backLinkHref: string): void {
    logger.debug(`${_renderStopScreen.name}: Rendering cannot add user screen`);
    res.render(CANNOT_ADD_USER, {
        serviceName: translations.service_name,
        title: translations.cannot_add_user_title,
        heading: translations.cannot_add_user_heading,
        paragraph1: translations.cannot_add_user_paragraph1,
        paragraph2: translations.cannot_add_user_paragraph2,
        paragraph3: translations.cannot_add_user_paragraph3,
        backLinkText: translations.back_link_text,
        backLinkHref: backLinkHref,
        manageUsersLinkText: `${translations.manage_users_link_text} ${acspName}.`,
        manageUsersLinkHref: constants.MANAGE_USER_FULL_URL
    });
}
