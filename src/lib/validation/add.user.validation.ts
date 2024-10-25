import { ViewData } from "../../types/utilTypes";
import { validateEmailString } from "../../lib/validation/email.validation";
import { addErrorToViewData } from "../../lib/utils/viewUtils";
import { validateRole } from "./user.role.validation";
import * as constants from "../constants";

export const FormInputNames = {
    EMAIL: "email",
    USER_ROLE: "userRole"
} as const;

export const validateAndSetErrors = (
    email: string,
    role: string,
    viewData: ViewData
): void => {
    const emailErrorMessage = validateAddUserEmail(email);
    if (emailErrorMessage) {
        addErrorToViewData(FormInputNames.EMAIL, emailErrorMessage, viewData);
    }
    const roleErrorMessage = validateRole(role);
    if (roleErrorMessage) {
        addErrorToViewData(FormInputNames.USER_ROLE, roleErrorMessage, viewData);
    }
};

export const validateAddUserEmail = (email: string): string | undefined => {
    if (!email) {
        return constants.ERRORS_EMAIL_REQUIRED;
    } else if (!validateEmailString(email)) {
        return constants.ERRORS_EMAIL_INVALID;
    }
};
