import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { UserRoleChangeData } from "../../types/utilTypes";
import { Update } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRole } from "../../lib/utils/userRoleUtils";
import { updateOrRemoveUserAcspMembership } from "../../services/acspMemberService";

export const tryEditMemberRolePost = async (req: Request, res: Response): Promise<void> => {
    const userRoleChangeData: UserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    const userRoleToUpdate: Update = {
        userRole: getUserRole(userRoleChangeData.userRole)
    };
    await updateOrRemoveUserAcspMembership(req, userRoleChangeData.acspMembershipId, userRoleToUpdate);
    res.redirect(constants.CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL);
};
