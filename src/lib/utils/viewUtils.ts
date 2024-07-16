import { ViewData } from "../../types/utilTypes";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { UserRoleTag } from "../../types/userRoleTag";

export const getLink = (href: string, displayText: string): string => {
    return `<a href="${href}">${displayText}</a>`;
};

export const getHiddenText = (hiddenText: string): string => {
    return `<span class="govuk-visually-hidden">${hiddenText}</span>`;
};

export const addErrorToViewData = (
    errProp: string,
    errorMsg: string,
    viewData: ViewData
): void => {
    viewData.errors = {
        ...viewData.errors,
        [errProp]: {
            text: errorMsg
        }
    };
};

export const getUserRoleTag = (userRole: UserRole, isLowerCase: boolean): string => {
    let tag = "";

    switch (userRole) {
    case UserRole.ADMIN:
        tag = UserRoleTag.ADMIN.toString();
        break;
    case UserRole.OWNER:
        tag = UserRoleTag.OWNER.toString();
        break;
    case UserRole.STANDARD:
        tag = UserRoleTag.STANDARD.toString();
        break;
    default:
        throw new Error(`Unknown user role: ${userRole}`);
    }

    return isLowerCase ? tag.toLowerCase() : tag;
};
