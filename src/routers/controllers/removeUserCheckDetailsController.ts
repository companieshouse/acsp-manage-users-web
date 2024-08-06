import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";
import { getExtraData, setExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval, Membership } from "../../types/membership";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { validateIdParam } from "../../lib/validation/string.validation";

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);
    res.render(constants.REMOVE_MEMBER_PAGE, viewData);
};

const getViewData = async (req: Request): Promise<AnyRecord> => {
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    const { userRole, acspName, userId } = loggedUserAcspMembership;
    if (!userRole || userRole === UserRole.STANDARD) {
        throw new Error(`user not authorised to remove, role is ${userRole}`);
    }
    const validParam = validateIdParam(req.params.id);
    if (!validParam) {
        throw new Error("invalid id param");
    }
    const id = req.params.id;
    const existingUsers = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const userToRemove = existingUsers.find((member: Membership) => member.id === id);

    if (!userToRemove) {
        throw new Error(`ACSP member with id ${id} not found in session`);
    }

    if (userToRemove.userRole === UserRole.OWNER && userRole === UserRole.ADMIN) {
        throw new Error("Admin user cannot remove an owner");
    }

    const removingThemselves = userId === userToRemove.userId;
    setExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE, { ...userToRemove, removingThemselves } as MemberForRemoval);

    return {
        removingThemselves,
        lang: getTranslationsForView(req.t, constants.REMOVE_MEMBER_PAGE),
        userDetails: userToRemove.displayNameOrEmail,
        companyName: acspName,
        cancelLinkHref: constants.MANAGE_USER_FULL_URL,
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        removeButtonHref: constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL,
        tryRemovingUserUrl: constants.TRY_REMOVING_USER_FULL_URL
    };
};
