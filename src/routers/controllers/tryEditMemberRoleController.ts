import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { UserRoleChangeData } from "../../types/utilTypes";
import { Update } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRole } from "../../lib/utils/userRoleUtils";
import { updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import { acspLogger } from "../../lib/helpers/acspLogger";

export const tryEditMemberRolePost = async (req: Request, res: Response): Promise<void> => {
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const userRoleToUpdate: Update = {
        updateUser: { userRole: getUserRole(userRoleChangeData.userRole) }
    };
    acspLogger(req.session, tryEditMemberRolePost.name, `About to edit user role: calling PATCH /acsps/memberships/${userRoleChangeData.acspMembershipId}`);

    await updateOrRemoveUserAcspMembership(req, userRoleChangeData.acspMembershipId, userRoleToUpdate);
    acspLogger(req.session, tryEditMemberRolePost.name, `Successfully edited user role: redirecting to confirmation member role edited`);

    res.redirect(constants.CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL);
};
