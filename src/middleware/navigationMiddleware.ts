import { NextFunction, Request, Response } from "express";
import * as constants from "../lib/constants";
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
    [constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL]: {
        allowedReferers: [constants.CHECK_MEMBER_DETAILS_FULL_URL, constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL],
        redirectTo: constants.MANAGE_USER_FULL_URL
    }
};

export const navigationMiddleware = (req: Request, res: Response, next: NextFunction): void => {

    const callerURL = req.headers.referer || "";
    let currentPath = req.path;

    if (req.params.id) {
        currentPath = currentPath.replace(req.params.id, ":id");
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
