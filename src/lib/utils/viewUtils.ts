import { BaseViewData } from "../../types/utilTypes";
import { UserRoleTagEn, UserRoleTagCy } from "../../types/userRoleTagEn";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { KnownUserRole } from "../../types/viewTypes";

export const getLink = (href: string, displayText: string): string => {
    return `<a data-event-id="remove" href="${href}">${displayText}</a>`;
};

export const getHiddenText = (hiddenText: string): string => {
    return `<span class="govuk-visually-hidden">${hiddenText}</span>`;
};

export const addErrorToViewData = (
    errProp: string,
    errorMsg: string,
    viewData: BaseViewData
): void => {
    viewData.errors = {
        ...viewData.errors,
        [errProp]: {
            text: errorMsg
        }
    };
};

const translations = {
    en: {
        [UserRole.OWNER]: UserRoleTagEn.OWNER,
        [UserRole.ADMIN]: UserRoleTagEn.ADMIN,
        [UserRole.STANDARD]: UserRoleTagEn.STANDARD
    },
    cy: {
        [UserRole.OWNER]: UserRoleTagCy.OWNER,
        [UserRole.ADMIN]: UserRoleTagCy.ADMIN,
        [UserRole.STANDARD]: UserRoleTagCy.STANDARD
    }
};

export const getUserRoleTag = (userRole: KnownUserRole, locale: string, isLowerCase: boolean): string => {
    const translationMap = translations[locale as keyof typeof translations] || translations.en;
    const tag = translationMap[userRole] || userRole;
    return isLowerCase ? tag.toLowerCase() : tag;
};
