import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, setExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval, Membership } from "../../types/membership";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { validateIdParam } from "../../lib/validation/string.validation";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { fetchAndValidateMembership } from "../../lib/helpers/fetchAndValidateMembership";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface RemoveUserCheckDetailsGetViewData extends ViewDataWithBackLink {
    removingThemselves: boolean,
    userDetails: string,
    companyName: string,
    tryRemovingUserUrl: string,
    displayNameInFirstParagraph: string,
}

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
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
    const existingUsers: Membership[] = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP) || [];
    let userToRemove: Membership | undefined = existingUsers.find((member: Membership) => member.id === id);

    if (!userToRemove) {
        acspLogger(req.session, removeUserCheckDetailsControllerGet.name, "ACSP Member for removal not found in session, calling GET /acsps/memberships/id");
        userToRemove = await fetchAndValidateMembership(req, id);
    }

    if (userToRemove.userRole === UserRole.OWNER && userRole === UserRole.ADMIN) {
        throw new Error("Admin user cannot remove an owner");
    }

    const removingThemselves = userId === userToRemove.userId;
    setExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE, { ...userToRemove, removingThemselves } as MemberForRemoval);

    let displayNameInFirstParagraph: string;
    const { userDisplayName, userEmail } = userToRemove;

    if (userDisplayName && userDisplayName !== constants.LANG_KEY_FOR_NOT_PROVIDED && userDisplayName !== constants.NOT_PROVIDED) {
        displayNameInFirstParagraph = `${userDisplayName} (${userEmail})`;
    } else {
        displayNameInFirstParagraph = `${userEmail}`;
    }

    const viewData: RemoveUserCheckDetailsGetViewData = {
        lang: getTranslationsForView(req.lang, constants.REMOVE_MEMBER_PAGE),
        templateName: constants.REMOVE_MEMBER_PAGE,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        tryRemovingUserUrl: constants.TRY_REMOVING_USER_FULL_URL,
        userDetails: userToRemove.displayNameOrEmail,
        companyName: acspName,
        removingThemselves,
        displayNameInFirstParagraph
    };
    acspLogger(req.session, removeUserCheckDetailsControllerGet.name, `Rendering remove member page, id: ${id}`);

    res.render(constants.REMOVE_MEMBER_PAGE, viewData);
};
