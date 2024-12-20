import { Request, Response } from "express";
import logger from "../../lib/Logger";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRoleChangeData, ViewDataWithBackLink } from "../../types/utilTypes";
import { deleteExtraData, getExtraData, getLoggedUserAcspMembership, setExtraData } from "../../lib/utils/sessionUtils";
import { Membership } from "../../types/membership";
import { isValidRole } from "../../lib/validation/user.role.validation";
import { addErrorToViewData } from "../../lib/utils/viewUtils";
import { FormInputNames } from "../../lib/validation/add.user.validation";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getAcspMemberships } from "../../services/acspMemberService";
import { getEditMemberRoleFullUrl } from "../../lib/utils/urlUtils";

export const editMemberRoleControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);

    if (viewData.isTheOnlyOwner) {
        const userRoleChangeData = getUserRoleChangeData(req, viewData);
        setExtraData(req.session, constants.USER_ROLE_CHANGE_DATA, userRoleChangeData);
        res.redirect(constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL);
    } else {
        res.render(constants.EDIT_MEMBER_ROLE_PAGE, viewData);
    }
};

export const editMemberRoleControllerPost = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);
    const newUserRole = req.body.userRole;
    if (!isValidRole(newUserRole) || newUserRole === viewData.oldUserRole) {
        viewData.userRole = viewData.oldUserRole;
        addErrorToViewData(FormInputNames.USER_ROLE, constants.ERRORS_SELECT_USER_ROLE_TO_CHANGE_FOR_THE_USER, viewData);
        setExtraData(req.session, constants.IS_SELECT_USER_ROLE_ERROR, true);
        return res.render(constants.EDIT_MEMBER_ROLE_PAGE, viewData);
    } else {
        const userRoleChangeData = getUserRoleChangeData(req, viewData);
        setExtraData(req.session, constants.USER_ROLE_CHANGE_DATA, userRoleChangeData);
        deleteExtraData(req.session, constants.IS_SELECT_USER_ROLE_ERROR);
        return res.redirect(constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL);
    }
};

interface EditMemberRoleViewData extends ViewDataWithBackLink {
    loggedInUserRole: UserRole,
    companyName: string,
    email: string,
    userRole: string,
    oldUserRole: UserRole,
    userDisplayName: string | undefined,
    isTheOnlyOwner?: boolean,
}

const getViewData = async (req: Request): Promise<EditMemberRoleViewData> => {
    const translations = getTranslationsForView(req.lang, constants.EDIT_MEMBER_ROLE_PAGE);
    const { acspName, userRole, userEmail } = getLoggedUserAcspMembership(req.session);

    if (userRole === UserRole.STANDARD) {
        const errorMessage = `User ${userEmail} with user role ${userRole} is not allowed to change another user role.`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    const id = req.params.id;
    const existingUsers = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const userToChangeRole: Membership = existingUsers.find((member: Membership) => member.id === id);

    const viewData: EditMemberRoleViewData = {
        lang: translations,
        loggedInUserRole: userRole,
        companyName: acspName,
        email: userToChangeRole.userEmail,
        userRole: userToChangeRole.userRole,
        oldUserRole: userToChangeRole.userRole,
        userDisplayName: userToChangeRole.userDisplayName === constants.NOT_PROVIDED ? undefined : userToChangeRole.userDisplayName,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.EDIT_MEMBER_ROLE_PAGE
    };

    if (userToChangeRole.userRole === UserRole.OWNER && await isTheOnlyOwner(req, userToChangeRole.acspNumber, userToChangeRole.userId)) {
        viewData.isTheOnlyOwner = true;
    }

    const isSelectUserRoleError: boolean = getExtraData(req.session, constants.IS_SELECT_USER_ROLE_ERROR);
    if (isSelectUserRoleError) {
        addErrorToViewData(FormInputNames.USER_ROLE, constants.ERRORS_SELECT_USER_ROLE_TO_CHANGE_FOR_THE_USER, viewData);
    }

    const savedUserRoleChangeData = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA) as UserRoleChangeData;
    if (!isSelectUserRoleError && savedUserRoleChangeData) {
        viewData.userRole = savedUserRoleChangeData.userRole;
    }

    return viewData;
};

const isTheOnlyOwner = async (req: Request, acspNumber: string, userId: string): Promise<boolean> => {
    const ownerMembers = await getAcspMemberships(req, acspNumber, false, 0, 20, [UserRole.OWNER]);
    return ownerMembers?.items?.length === 1 && ownerMembers.items[0].userId === userId;
};

const getUserRoleChangeData = (req: Request, viewData: EditMemberRoleViewData): UserRoleChangeData => {
    const newUserRole = req.body.userRole;
    const id = req.params.id;
    const url = getEditMemberRoleFullUrl(id);
    const sanitizedUrl = sanitizeUrl(url);
    return {
        acspMembershipId: id,
        userRole: newUserRole,
        userEmail: viewData.email as string,
        userDisplayName: viewData.userDisplayName,
        changeRolePageUrl: sanitizedUrl
    };
};
