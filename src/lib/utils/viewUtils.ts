import { AnyRecord, BaseViewData } from "../../types/utilTypes";
import { UserRoleTagEn, UserRoleTagCy } from "../../types/userRoleTagEn";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { KnownUserRole } from "../../types/viewTypes";

// export const getStatusTag = (status: string, translations: AnyRecord): string => {
//     const label = translations[status] || status; // status key used as-is (e.g. "Pending")
//     const statusKey = status?.toLowerCase?.() ?? "";

//     const tagClass = {
//         active: "govuk-tag govuk-tag--green",
//         pending: "govuk-tag govuk-tag--yellow",
//         invited: "govuk-tag govuk-tag--yellow",
//         removed: "govuk-tag govuk-tag--red",
//         suspended: "govuk-tag govuk-tag--red",
//         ceased: "govuk-tag govuk-tag--red"
//     }[statusKey] || "govuk-tag govuk-tag--grey";

//     return `<strong class="${tagClass}">${label}</strong>`;
// };
// export const getStatusTag = (status: string, translations: AnyRecord): string => {
//     const rawLabel = (translations[status] || status) as string;
//     const capitalisedLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

//     return `<strong class="govuk-tag govuk-tag--green">${capitalisedLabel}</strong>`;
// };
export const getStatusTag = (status: string, translations: AnyRecord): string => {
    const rawLabel = (translations[status] || status) as string;
    const capitalisedLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

    const tagColourClass = {
        active: "govuk-tag--green",
        pending: "govuk-tag--yellow",
        removed: "govuk-tag--red"
    }[status.toLowerCase()] || "govuk-tag--grey"; // Fallback if unknown status

    return `<strong class="govuk-tag ${tagColourClass}">${capitalisedLabel}</strong>`;
};

export const getLink = (href: string, displayText: string, dataEventId: string): string => {
    return `<a data-event-id="${dataEventId}" href="${href}">${displayText}</a>`;
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
