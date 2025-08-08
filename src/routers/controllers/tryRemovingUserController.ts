import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";
import { getAcspMemberships, updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import { acspLogger } from "../../lib/helpers/acspLogger";

export const tryRemovingUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const memberForRemoval: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    const { userId, acspNumber } = loggedUserAcspMembership;
    const removingThemselves = memberForRemoval.userId === userId;

    if (removingThemselves) {
        acspLogger(req.session, tryRemovingUserControllerPost.name, `User is removing themselves, checking if they are the only owner ... `);

        const ownerMembers = await getAcspMemberships(req, acspNumber, false, 0, 20, [UserRole.OWNER]);

        if (ownerMembers?.items?.length === 1 && ownerMembers.items[0].userId === userId) {
            acspLogger(req.session, tryRemovingUserControllerPost.name, `User is removing themselves but is the only owner, redirecting to stop page (add acc owner) ... `);
            return res.redirect(constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL);
        }
        acspLogger(req.session, tryRemovingUserControllerPost.name, `User is removing themselves and is not the only owner ... `);

    }
    acspLogger(req.session, tryRemovingUserControllerPost.name, `Removing member ${memberForRemoval.id}`);

    await updateOrRemoveUserAcspMembership(req, memberForRemoval.id, { removeUser: true });

    if (removingThemselves) {
        acspLogger(req.session, tryRemovingUserControllerPost.name, "User has removed themselves, redirecting to sign out now ... ");

        res.set("Referrer-Policy", "origin");
        res.removeHeader("Content-Security-Policy");
        return res.redirect(constants.SIGN_OUT_URL);

    } else {
        acspLogger(req.session, tryRemovingUserControllerPost.name, `Successfully removed member ${memberForRemoval.id}, redirecting to confirmation member removed`);
        res.redirect(constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL);
    }
};
