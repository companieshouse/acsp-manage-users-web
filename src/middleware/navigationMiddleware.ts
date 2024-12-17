import { NextFunction, Request, Response } from "express";
import * as constants from "../lib/constants";
import * as url from "node:url";
import logger from "../lib/Logger";
import { Navigation } from "types/navigation";
import { getRemoveMemberCheckDetailsFullUrl } from "../lib/utils/urlUtils";
import { UserRole, AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData } from "../lib/utils/sessionUtils";
import { REMOVE_MEMBER_CHECK_DETAILS_FULL_URL, REMOVE_MEMBER_CHECK_DETAILS_URL } from "../lib/constants";

export const NAVIGATION: Navigation = {
    [constants.CHECK_MEMBER_DETAILS_FULL_URL]: {
        allowedReferers: [constants.ADD_USER_FULL_URL, constants.CHECK_MEMBER_DETAILS_FULL_URL, constants.CANNOT_ADD_USER_FULL_URL],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.CONFIRMATION_MEMBER_ADDED_FULL_URL]: {
        allowedReferers: [constants.CHECK_MEMBER_DETAILS_FULL_URL, constants.CONFIRMATION_MEMBER_ADDED_FULL_URL],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL]: {
        allowedReferers: [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL, constants.MANAGE_USERS_FULL_URL, constants.STOP_PAGE_ADD_ACCOUNT_OWNER_URL_FULL_URL],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL]: {
        allowedReferers: [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL, constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL]: {
        allowedReferers: [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL, constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL],
        redirectTo: constants.CHS_SEARCH_REGISTER_PAGE,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.CANNOT_ADD_USER_FULL_URL]: {
        allowedReferers: [constants.CHECK_MEMBER_DETAILS_FULL_URL, constants.CANNOT_ADD_USER_FULL_URL],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.STOP_PAGE_ADD_ACCOUNT_OWNER_URL_FULL_URL]: {
        allowedReferers: [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL, constants.STOP_PAGE_ADD_ACCOUNT_OWNER_URL_FULL_URL],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.ADD_USER_FULL_URL]: {
        allowedReferers: [],
        redirectTo: constants.VIEW_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    }
};

export const navigationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const callerURL = url.parse(req.headers.referer || "", true).pathname || "";
    let currentPath = url.parse(req.originalUrl, true).pathname || "";

    // this is to strip the path parameter which is redundant in this context
    if (currentPath.startsWith(constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL)) {
        currentPath = constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL;
    }

    if (!NAVIGATION[currentPath]) {
        logger.info("navigation not found for the current path.");
        return next();
    }

    const { allowedReferers, redirectTo, allowedUserRoles } = NAVIGATION[currentPath];

    if (allowedReferers?.length) {
        const refererAllowed = allowedReferers.some(ref => callerURL.includes(ref));

        if (!refererAllowed) {
            logger.info(`calling redirect, callerurl: ${callerURL}, currentPath: ${currentPath}`);
            return res.redirect(redirectTo);
        }
    }
    if (allowedUserRoles?.length) {
        const acspMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
        const { userRole } = acspMembership;
        if (!allowedUserRoles.includes(userRole)) {
            logger.info(`calling redirect, role ${userRole} not permitted for currentPath: ${currentPath}`);
            return res.redirect(redirectTo);
        }
    }
    logger.info("referer and role are ok.");
    return next();
};
