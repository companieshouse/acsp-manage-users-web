import { NextFunction, Request, Response } from "express";
import * as constants from "../lib/constants";
import * as url from "node:url";
import logger from "../lib/Logger";
import { Navigation } from "../types/navigation";
import { UserRole, AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getExtraData } from "../lib/utils/sessionUtils";
import { acspLogger } from "../lib/helpers/acspLogger";

export const NAVIGATION: Navigation = {
    [constants.CHECK_MEMBER_DETAILS_FULL_URL]: {
        allowedReferers: [
            constants.ADD_USER_FULL_URL,
            constants.CHECK_MEMBER_DETAILS_FULL_URL,
            constants.CANNOT_ADD_USER_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.CONFIRMATION_MEMBER_ADDED_FULL_URL]: {
        allowedReferers: [
            constants.CHECK_MEMBER_DETAILS_FULL_URL,
            constants.CONFIRMATION_MEMBER_ADDED_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL]: {
        allowedReferers: [
            constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
            constants.MANAGE_USERS_FULL_URL,
            constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL]: {
        allowedReferers: [
            constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
            constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL]: {
        allowedReferers: [
            constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
            constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL
        ],
        redirectTo: constants.CHS_SEARCH_REGISTER_PAGE,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.CANNOT_ADD_USER_FULL_URL]: {
        allowedReferers: [
            constants.CHECK_MEMBER_DETAILS_FULL_URL,
            constants.CANNOT_ADD_USER_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [UserRole.OWNER, UserRole.ADMIN]
    },
    [constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL]: {
        allowedReferers: [
            constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
            constants.MANAGE_USERS_FULL_URL,
            constants.STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.ADD_USER_FULL_URL]: {
        allowedReferers: [],
        redirectTo: constants.VIEW_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.EDIT_MEMBER_ROLE_FULL_URL]: {
        allowedReferers: [
            constants.EDIT_MEMBER_ROLE_FULL_URL,
            constants.MANAGE_USERS_FULL_URL,
            constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL]: {
        allowedReferers: [
            constants.EDIT_MEMBER_ROLE_FULL_URL,
            constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL]: {
        allowedReferers: [
            constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL,
            constants.CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL
        ],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.OWNER,
            UserRole.ADMIN
        ]
    },
    [constants.VIEW_USERS_FULL_URL]: {
        allowedReferers: [],
        redirectTo: constants.MANAGE_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.STANDARD
        ]
    },
    [constants.MANAGE_USERS_FULL_URL]: {
        allowedReferers: [],
        redirectTo: constants.VIEW_USERS_FULL_URL,
        allowedUserRoles: [
            UserRole.ADMIN,
            UserRole.OWNER
        ]
    }
};

export const navigationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const callerURL = url.parse(req.headers.referer || "", true).pathname || "";
    let currentPath = url.parse(req.originalUrl, true).pathname || "";
    const acspMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);

    if (currentPath === constants.ACCESS_DENIED_FULL_URL && acspMembership?.userRole) {
        return res.redirect(constants.DASHBOARD_FULL_URL);
    }

    // this is to strip the path parameter which is redundant in this context
    if (currentPath.startsWith(constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL)) {
        currentPath = constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL;
    } else if (currentPath.startsWith(constants.EDIT_MEMBER_ROLE_FULL_URL)) {
        currentPath = constants.EDIT_MEMBER_ROLE_FULL_URL;
    }

    if (!NAVIGATION[currentPath]) {
        logger.info(`Navigation not found for the current path: ${currentPath}`);
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
        const { userRole } = acspMembership;
        if (!allowedUserRoles.includes(userRole)) {
            logger.info(`calling redirect, role ${userRole} not permitted for currentPath: ${currentPath}`);
            return res.redirect(redirectTo);
        }
    }
    acspLogger(req.session, `Referer and role ok: ${req.originalUrl}`);

    return next();
};
