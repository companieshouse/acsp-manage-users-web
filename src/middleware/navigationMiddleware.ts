import { NextFunction, Request, Response } from "express";
import * as constants from "../lib/constants";
import * as url from "node:url";

export interface Navigation {
    [x: string]: {
        allowedReferers: string[];
        redirectTo: string;
    };
}
export const NAVIGATION: Navigation = {
    [constants.CHECK_MEMBER_DETAILS_FULL_URL]: {
        allowedReferers: [constants.ADD_USER_FULL_URL, constants.CHECK_MEMBER_DETAILS_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    },
    [constants.CONFIRMATION_MEMBER_ADDED_FULL_URL]: {
        allowedReferers: [constants.CHECK_MEMBER_DETAILS_FULL_URL, constants.CONFIRMATION_MEMBER_ADDED_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    },
    [constants.getRemoveMemberCheckDetailsFullUrl("")]: {
        allowedReferers: [constants.getRemoveMemberCheckDetailsFullUrl(""), constants.MANAGE_USER_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    },
    [constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL]: {
        allowedReferers: [constants.getRemoveMemberCheckDetailsFullUrl(""), constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    },
    [constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL]: {
        allowedReferers: [constants.getRemoveMemberCheckDetailsFullUrl(""), constants.CONFIRMATION_YOU_ARE_REMOVED_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    },
    [constants.CANNOT_ADD_USER_FULL_URL]: {
        allowedReferers: [constants.CHECK_MEMBER_DETAILS_FULL_URL, constants.CANNOT_ADD_USER_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    },
    [constants.STOP_PAGE_ADD_ACCOUNT_OWNER_URL_FULL_URL]: {
        allowedReferers: [constants.getRemoveMemberCheckDetailsFullUrl(""), constants.STOP_PAGE_ADD_ACCOUNT_OWNER_URL_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    }

};

export const navigationMiddleware = (req: Request, res: Response, next: NextFunction): void => {

    const callerURL = url.parse(req.headers.referer || "", true).pathname || "";
    let currentPath = url.parse(req.originalUrl, true).pathname || "";
    if (currentPath.startsWith(constants.getRemoveMemberCheckDetailsFullUrl(""))) {
        currentPath = constants.getRemoveMemberCheckDetailsFullUrl("");
    }

    console.log("caller URL ", callerURL);
    console.log("current path ", currentPath);
    // if the current path is the check member details page before you add a user
    // then the referrer must be manage users page
    if (!NAVIGATION[currentPath]) {
        console.log("navigation for this path not found.");
        return next();

    }
    const { allowedReferers, redirectTo } = NAVIGATION[currentPath];
    const refererAllowed = allowedReferers.some(ref => callerURL.includes(ref));
    if (!refererAllowed) {
        console.log("redirecting...");
        return res.redirect(redirectTo);
    } else {
        console.log("navigation found, refferrer is ok.");
        return next();
    }
};
