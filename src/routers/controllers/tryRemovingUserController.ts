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
        const ownerMembers = await getAcspMemberships(req, acspNumber, false, 0, 20, [UserRole.OWNER]);

        if (ownerMembers?.items?.length === 1 && ownerMembers.items[0].userId === userId) {
            return res.redirect(constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL);
        }
    }
    await updateOrRemoveUserAcspMembership(req, memberForRemoval.id, { removeUser: true });

    if (removingThemselves) {
        logger.info("User has removed themselves, redirecting to sign out now ... ");
        res.set("Referrer-Policy", "origin");
        return res.redirect(constants.SIGN_OUT_URL);
    } else {
        res.redirect(constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL);
    }
};
