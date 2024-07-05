import { ViewData } from "../../types/utilTypes";
import { UserRoleTag } from "../../types/userRole";

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

// Temporary function to be used until relevant API calls available
export const getUserRoleTag = (userEmailAddress: string): string => {
    switch (userEmailAddress) {
    case "k.williams@example.com":
        return UserRoleTag.ADMIN.toString();
    case "j.smith@example.com":
        return UserRoleTag.OWNER.toString();
    default:
        return UserRoleTag.STANDARD.toString();
    }
};
