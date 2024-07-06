import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { validateEmailString } from "../../lib/validation/validateEmail";
import { setExtraData, getExtraData } from "../../lib/utils/sessionUtils";

export type AnyRecord = Record<string, unknown>;

export type ViewData = {
    lang: AnyRecord;
    errors?:
      | {
          [key: string]: {
            text: string;
          };
        }
      | undefined;
      companyName?: string;
      backLinkUrl?:string;
      email?:string;
      role?:string;
  };

export const validateAddUserEmail = (email:string):string|undefined => {
    if (!email) {
        return constants.ERRORS_EMAIL_REQUIRED;
    } else if (!validateEmailString(email)) {
        return constants.ERRORS_EMAIL_INVALID;
    }
};

export const validateRole = (role:string):string|undefined => {
    if (role === "accountOwner" || role === "administrator" || role === "standardUser") {
        return undefined;
    }
    return constants.ERRORS_SELECT_USER_ROLE;
};

export const setError = (errProp: string, errorMsg:string, viewData:ViewData):void => {
    viewData.errors = {
        ...viewData.errors,
        [errProp]: {
            text: errorMsg
        }
    };
};

export const validateAndSetErrors = (email:string, role:string, viewData:ViewData):void => {
    const emailErrorMessage = validateAddUserEmail(email);
    if (emailErrorMessage) {
        setError("email", emailErrorMessage, viewData);
    }
    const roleErrorMessage = validateRole(role);
    if (roleErrorMessage) {
        setError("role", roleErrorMessage, viewData);
    }
};

export interface UserAndRole {
    email: string;
    role: string;
    valid: boolean;
}

export const addUserControllerGet = async (req: Request, res: Response): Promise<void> => {

    const viewData:ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL
    };
    const savedUserAndRole: UserAndRole = getExtraData(req.session, "userAndRole");

    if (savedUserAndRole) {
        validateAndSetErrors(savedUserAndRole.email, savedUserAndRole.role, viewData);
        viewData.email = savedUserAndRole.email;
        viewData.role = savedUserAndRole.role;
    }
    console.log("GETview data ", viewData);
    console.log("GET view data errors", viewData.errors);

    res.render(constants.ADD_USER_PAGE, viewData);
};

export const addUserControllerPost = async (req: Request, res: Response): Promise<void> => {

    const email = req.body.email.trim();
    const role = req.body.role;

    const viewData:ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        email,
        role
    };

    validateAndSetErrors(email, role, viewData);
    console.log("Post view data ", viewData);
    console.log("Post view data errors", viewData.errors);
    if (viewData.errors) {
        setExtraData(req.session, "userAndRole", { email, role, valid: false });
        return res.render(constants.ADD_USER_PAGE, viewData);
    } else {
        setExtraData(req.session, "userAndRole", { email, role, valid: true });
        return res.redirect(constants.DASHBOARD_FULL_URL);
    }

};
