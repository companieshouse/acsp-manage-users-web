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
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.OWNER) {
        throw new Error(`user not authorised to remove, role is ${userRole}`);
    }
    const validParam = validateIdParam(req.params.id);
    if (!validParam) {
        throw new Error("invalid id param");
    }
    const id = req.params.id;
    const existingUsers = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const userToRemove: Membership = existingUsers.find((member: Membership) => member.id === id);

    if (!userToRemove) {
        throw new Error(`ACSP member with id ${id} not found in session`);
    }

    if (userToRemove.userRole === UserRole.OWNER && userRole === UserRole.ADMIN) {
        throw new Error("Admin user cannot remove an owner");
    }

    const removingThemselves = userId === userToRemove.userId;
    setExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE, { ...userToRemove, removingThemselves } as MemberForRemoval);

    let displayNameInFirstParagraph;
    const { userDisplayName, userEmail } = userToRemove;
    if (userDisplayName && userDisplayName !== constants.NOT_PROVIDED) {
        displayNameInFirstParagraph = `${userDisplayName} (${userEmail})`;
    } else {
        displayNameInFirstParagraph = `${userEmail}`;
    }
    return {
        removingThemselves,
        lang: getTranslationsForView(req.t, constants.REMOVE_MEMBER_PAGE),
        userDetails: userToRemove.displayNameOrEmail,
        email: userToRemove.userEmail,
        companyName: acspName,
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        tryRemovingUserUrl: constants.TRY_REMOVING_USER_FULL_URL,
        displayNameInFirstParagraph
    };
};
