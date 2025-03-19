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

export const tryAddingUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const newUserDetails: NewUserDetails | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const { acspNumber, acspName } = loggedInUserMembership ?? {};
    if (!acspNumber || !acspName) {
        logger.error(`${tryAddingUserControllerPost.name}: Unable to retrieve ACSP number or name for the logged-in user`);
        res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
        return;
    }

    if (!newUserDetails?.email) {
        logger.error(`${tryAddingUserControllerPost.name}: New user details or email not found in session`);
        res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
        return;
    }

    const userDetailsFromApi = await getUserDetails(newUserDetails.email);
    if (!userDetailsFromApi?.length) {
        logger.info(`${tryAddingUserControllerPost.name} GET /user/search - email not found, redirecting to cannot add user stop screen`);
        return res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
    }
    logger.info(`${tryAddingUserControllerPost.name} GET /user/search - email was successfully found`);
    const firstUser = userDetailsFromApi[0];
    try {
        logger.info(`${tryAddingUserControllerPost.name}: Calling createAcspMembership /acsps/${acspNumber}/memberships`);
        await createAcspMembership(req, acspNumber, firstUser.userId as string, newUserDetails.userRole as UserRole);
        logger.info(`${tryAddingUserControllerPost.name}: Successfully added user ${firstUser.userId} to ACSP ${acspNumber}, redirecting to confirmation page`);
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        logger.error(`${tryAddingUserControllerPost.name}: Error adding user to ACSP: ${err}`);
        res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
    }
};
