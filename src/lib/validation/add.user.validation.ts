import { ViewData } from "../../types/utilTypes";
import { validateEmailString } from "../../lib/validation/email.validation";
import { addErrorToViewData } from "../../lib/utils/viewUtils";
import { validateRole } from "./user.role.validation";
import * as constants from "../constants";
import { Request } from "express";
import { getUserDetails } from "../../services/userAccountService";
import { User } from "private-api-sdk-node/dist/services/user-account/types";
import { setExtraData } from "../../lib/utils/sessionUtils";

const FormInputNames = {
    EMAIL: "email",
    USER_ROLE: "userRole"
} as const;

export const validateAndSetErrors = async (
    req: Request,
    email: string,
    role: string,
    viewData: ViewData
): Promise<void> => {
    const emailErrorMessage = await validateAddUserEmail(req, email);
    if (emailErrorMessage) {
        addErrorToViewData(FormInputNames.EMAIL, emailErrorMessage, viewData);
    }
    const roleErrorMessage = validateRole(role);
    if (roleErrorMessage) {
        addErrorToViewData(FormInputNames.USER_ROLE, roleErrorMessage, viewData);
    }
};

export const validateAddUserEmail = async (req: Request, email: string): Promise<string | undefined> => {
    if (!email) {
        return Promise.resolve(constants.ERRORS_EMAIL_REQUIRED);
    } else if (!validateEmailString(email)) {
        return Promise.resolve(constants.ERRORS_EMAIL_INVALID);
    } else {
        const foundUser = await getUserDetails(email);
        if (foundUser?.length) {
            console.log("user is ", foundUser[0]);
            setExtraData(req.session, "newUserApiDetails", foundUser[0] as User);
            return Promise.resolve(undefined);
        } else {
            return Promise.resolve(constants.ERRORS_NO_CH_ACCOUNT);
        }
    }
};
