import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";
import { getAcspMemberships, updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import logger from "../../lib/Logger";

export const tryRemovingUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const memberForRemoval: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    const { userId, acspNumber } = loggedUserAcspMembership;
    const removingThemselves = memberForRemoval.userId === userId;

    if (removingThemselves) {
        logger.info(`${tryRemovingUserControllerPost.name} User is removing themselves, checking if they are the only owner ... `);

        const ownerMembers = await getAcspMemberships(req, acspNumber, false, 0, 20, [UserRole.OWNER]);

        if (ownerMembers?.items?.length === 1 && ownerMembers.items[0].userId === userId) {
            logger.info(`${tryRemovingUserControllerPost.name} User is removing themselves but is the only owner, redirecting to stop page (add acc owner) ... `);
            return res.redirect(constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL);
        }
        logger.info(`${tryRemovingUserControllerPost.name} User is removing themselves and is not the only owner ... `);

    }
    logger.info(`${tryRemovingUserControllerPost.name}: Removing member ${memberForRemoval.id}`);

    await updateOrRemoveUserAcspMembership(req, memberForRemoval.id, { removeUser: true });

    if (removingThemselves) {
        logger.info("User has removed themselves, redirecting to sign out now ... ");
        res.set("Referrer-Policy", "origin");
        return res.redirect(constants.SIGN_OUT_URL);
    } else {
        logger.info(`${tryRemovingUserControllerPost.name}: Successfully removed member ${memberForRemoval.id}, redirecting to confirmation member removed`);
        res.redirect(constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL);
    }
};
