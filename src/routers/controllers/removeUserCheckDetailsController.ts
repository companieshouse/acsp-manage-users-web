import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, setExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { MemberForRemoval, Membership } from "../../types/membership";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { validateIdParam } from "../../lib/validation/string.validation";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { fetchAndValidateMembership } from "../../lib/helpers/fetchAndValidateMembership";
import logger from "../../lib/Logger";
import { generateCacheKey } from "../../services/acspMemberService";
import { getDisplayNameOrEmail, getDisplayNameOrNotProvided } from "./manageUsersController";

interface RemoveUserCheckDetailsGetViewData extends ViewDataWithBackLink {
    removingThemselves: boolean,
    userDetails: string,
    companyName: string,
    tryRemovingUserUrl: string,
    displayNameInFirstParagraph: string,
}

function validateAndReturnRole (role: string): UserRole | undefined {
    switch (role) {
    case "owner":
        return UserRole.OWNER;
    case "admin":
        return UserRole.ADMIN;
    case "standard":
        return UserRole.STANDARD;
    }
}

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {

    const formatMember = (member: AcspMembership) => ({
        id: member.id,
        userId: member.userId,
        userEmail: member.userEmail,
        acspNumber: member.acspNumber,
        userRole: member.userRole,
        userDisplayName: getDisplayNameOrNotProvided(req.lang, member),
        displayNameOrEmail: getDisplayNameOrEmail(member)
    });
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
    const roleParam = req.query?.userRole || undefined;
    const pageParam = req.query?.page || undefined;
    console.log("role is ", roleParam);
    console.log("page is ", pageParam);
    let validatedRole;
    let cacheKey;
    let existingUsers = [];

    if (roleParam) {
        validatedRole = validateAndReturnRole(roleParam as string);
        if (validatedRole) {
            cacheKey = generateCacheKey(Number(pageParam) - 1, validatedRole);
            const cachedAcspMembershipData = getExtraData(req.session, "cachedAcspMembershipData");

            console.log("cachedAcspMembershipData", cachedAcspMembershipData);

            if (cachedAcspMembershipData && cacheKey in cachedAcspMembershipData) {
                console.log("Cache hit, checking if removal memeber is in session");
                existingUsers = JSON.parse(cachedAcspMembershipData[cacheKey]).items.map(formatMember);
                console.log("existing users", existingUsers);
            }

        }
    }

    //  const existingUsers: Membership[] = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP) || [];
    let userToRemove: Membership | undefined = existingUsers.find((member: Membership) => member.id === id);

    console.log("this was found from cache hit:", userToRemove);

    if (!userToRemove) {
        logger.info("ACSP Member for removal not found in session, calling GET /acsps/memberships/id");
        userToRemove = await fetchAndValidateMembership(req, id);
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

    res.render(constants.REMOVE_MEMBER_PAGE, viewData);
};
