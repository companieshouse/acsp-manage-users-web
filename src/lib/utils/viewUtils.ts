import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { UserRoleTag } from "../../types/userRoleTag";
import { ViewData } from "../../types/utilTypes";

export const getLink = (href: string, displayText: string): string => {
    return `<a href="${href}">${displayText}</a>`;
};

export const getHiddenText = (hiddenText: string): string => {
    return `<span class="govuk-visually-hidden">${hiddenText}</span>`;
};

export const getUserRoleTag = (userRole: UserRole): string => {
    switch (userRole) {
    case UserRole.ADMIN:
        return UserRoleTag.ADMIN.toString();
    case UserRole.OWNER:
        return UserRoleTag.OWNER.toString();
    default:
        return UserRoleTag.STANDARD.toString();
    }
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
