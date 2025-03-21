import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import {
    AcspMembership,
    UserRole
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../types/user";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { createAcspMembership } from "../../services/acspMemberService";
import { getUserDetails } from "../../services/userAccountService";
import { acspLogger } from "../../lib/helpers/acspLogger";

export const tryAddingUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const newUserDetails: NewUserDetails | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD);

    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const { acspNumber, acspName } = loggedInUserMembership ?? {};
    if (!acspNumber || !acspName) {
        acspLogger(req.session, `${tryAddingUserControllerPost.name}: Unable to retrieve ACSP number or name for the logged-in user`, true);
        res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
        return;
    }

    if (!newUserDetails?.email) {
        acspLogger(req.session, `${tryAddingUserControllerPost.name}: New user details or email not found in session`, true);
        res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
        return;
    }
    acspLogger(req.session, `${tryAddingUserControllerPost.name} Checking if email has been registered...`);

    const userDetailsFromApi = await getUserDetails(newUserDetails.email);
    if (!userDetailsFromApi?.length) {
        acspLogger(req.session, `${tryAddingUserControllerPost.name} GET /user/search - email not found, redirecting to cannot add user stop screen`);
        return res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
    }
    acspLogger(req.session, `${tryAddingUserControllerPost.name} GET /user/search - email was successfully found`);
    const firstUser = userDetailsFromApi[0];
    try {
        acspLogger(req.session, `${tryAddingUserControllerPost.name}: Calling createAcspMembership /acsps/${acspNumber}/memberships`);
        await createAcspMembership(req, acspNumber, firstUser.userId as string, newUserDetails.userRole as UserRole);
        acspLogger(req.session, `${tryAddingUserControllerPost.name}: Successfully added user ${firstUser.userId} to ACSP ${acspNumber}, redirecting to confirmation page`);
        res.redirect(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
    } catch (err: unknown) {
        acspLogger(req.session, `${tryAddingUserControllerPost.name}: Error adding user to ACSP: ${err}`, true);
        res.redirect(constants.CANNOT_ADD_USER_FULL_URL);
    }
};
