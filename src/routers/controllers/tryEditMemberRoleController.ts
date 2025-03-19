import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { UserRoleChangeData } from "../../types/utilTypes";
import { Update } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRole } from "../../lib/utils/userRoleUtils";
import { updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";
import logger from "../../lib/Logger";

export const tryEditMemberRolePost = async (req: Request, res: Response): Promise<void> => {
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const userRoleToUpdate: Update = {
        userRole: getUserRole(userRoleChangeData.userRole)
    };
    logger.info(`${tryEditMemberRolePost.name}: About to edit user role: calling PATCH /acsps/memberships/${userRoleChangeData.acspMembershipId}`);

    await updateOrRemoveUserAcspMembership(req, userRoleChangeData.acspMembershipId, userRoleToUpdate);
    logger.info(`${tryEditMemberRolePost.name}: Successfully edited user role: redirecting to confirmation member role edited`);

    res.redirect(constants.CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL);
};
