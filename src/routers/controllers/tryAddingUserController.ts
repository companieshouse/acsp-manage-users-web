import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { PLACEHOLDER_STOP_SCREEN, TRY_ADDING_USER } from "../../lib/constants";
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
    const acspNumber: string | null = loggedInUserMembership.items[0]?.acspNumber ?? null;
    if (!acspNumber) {
        logger.error(`${tryAddingUserControllerPost.name}: Unable to retrieve ACSP number for the logged-in user`);
        _renderStopScreen(res, translations);
        return;
    }

    if (!newUserDetails?.email) {
        logger.error(`${tryAddingUserControllerPost.name}: New user details or email not found in session`);
        throw new Error(`New user details or email not found in session`);
    }

    const userBeingAdded: User[] = await getUserDetails(newUserDetails.email);
    if (!userBeingAdded || userBeingAdded.length === 0) {
        logger.error(`${tryAddingUserControllerPost.name}: User not found. Email: ${newUserDetails.email}`);
        _renderStopScreen(res, translations);
        return;
    }

    const firstUser = userBeingAdded[0] as User;
    try {
        await createAcspMembership(req, acspNumber, firstUser.userId as string, newUserDetails.userRole as UserRole);
        logger.info(`${tryAddingUserControllerPost.name}: Successfully added user ${firstUser.userId} to ACSP ${acspNumber}`);
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        logger.error(`${tryAddingUserControllerPost.name}: Error adding user to ACSP: ${err}`);
        _renderStopScreen(res, translations);
    }
};

function _renderStopScreen (res: Response, translations: AnyRecord): void {
    logger.debug(`${_renderStopScreen.name}: Rendering placeholder stop screen`);
    res.render(PLACEHOLDER_STOP_SCREEN, {
        title: translations.there_is_a_problem,
        message: translations.unable_to_add_user,
        subheading: translations.what_happens_next,
        description: translations.error_logged_description,
        buttonText: translations.return_to_manage_users,
        buttonHref: constants.MANAGE_USER_FULL_URL,
        isPlaceholder: true
    });
}
