import { Request, Response } from "express";
import logger from "../../lib/Logger";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { UserRoleChangeData, ViewData } from "../../types/utilTypes";
import { getExtraData, getLoggedUserAcspMembership, setExtraData } from "../../lib/utils/sessionUtils";
import { Membership } from "../../types/membership";
import { isValidRole } from "../../lib/validation/user.role.validation";
import { addErrorToViewData } from "../../lib/utils/viewUtils";
import { FormInputNames } from "../../lib/validation/add.user.validation";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

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
    if (!isValidRole(newUserRole) || newUserRole === viewData.userRole) {
        addErrorToViewData(FormInputNames.USER_ROLE, constants.ERRORS_SELECT_USER_ROLE_TO_CHANGE_FOR_THE_USER, viewData);
        return res.render(constants.EDIT_MEMBER_ROLE_PAGE, viewData);
    } else {
        const userRoleChangeData = getUserRoleChangeData(req, viewData);
        setExtraData(req.session, constants.USER_ROLE_CHANGE_DATA, userRoleChangeData);
        return res.redirect(constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL);
    }
};

const getViewData = async (req: Request): Promise<ViewData> => {
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

    const viewData: ViewData = {
        lang: translations,
        loggedInUserRole: userRole,
        companyName: acspName,
        email: userToChangeRole.userEmail,
        userRole: userToChangeRole.userRole,
        userDisplayName: userToChangeRole.userDisplayName === constants.NOT_PROVIDED ? undefined : userToChangeRole.userDisplayName,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.EDIT_MEMBER_ROLE_PAGE,
        verifyPeopleIdentityFromDate: "XX DATE", // TODO - replace with live data once known
        fileAsAuthorisedAgentFromDate: "XX DATE" // TODO - replace with live data once known
    };

    if (userToChangeRole.userRole === UserRole.OWNER && isTheOnlyOwner(existingUsers)) {
        viewData.isTheOnlyOwner = true;
    }

    return viewData;
};

const isTheOnlyOwner = (users: Membership[]): boolean => users.filter(user => user.userRole === UserRole.OWNER).length === 1;

const getUserRoleChangeData = (req: Request, viewData: ViewData): UserRoleChangeData => {
    const newUserRole = req.body.userRole;
    const id = req.params.id;
    const url = `${constants.EDIT_MEMBER_ROLE_FULL_URL.replace(":id", id)}`;
    const sanitizedUrl = sanitizeUrl(url);
    return {
        acspMembershipId: id,
        userRole: newUserRole,
        userEmail: viewData.email as string,
        userDisplayName: viewData.userDisplayName,
        changeRolePageUrl: sanitizedUrl
    };
};
