import i18next from "i18next";
import { AnyRecord } from "../../types/utilTypes";
import * as constants from "../constants";
import {
    AcspStatus,
    MembershipStatus,
    UserRole
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const getTranslationsForView = (t: typeof i18next.t, viewName: string): AnyRecord => ({
    ...t(constants.COMMON, { returnObjects: true }),
    ...t(viewName, { returnObjects: true })
});

const translations = {
    en: {
        // From UserRole enum
        owner: "Owner",
        admin: "Administrator",
        standard: "Standard User",

        // From AcspStatus enum
        suspended: "Suspended",
        ceased: "Ceased",

        // From MembershipStatus enum
        removed: "Removed",

        // Appears in both AcspStatus and MembershipStatus enums
        active: "Active"
    },
    cy: {
        // From UserRole enum
        owner: "[CY] Owner",
        admin: "[CY] Administrator",
        standard: "[CY] Standard User",

        // From AcspStatus enum
        suspended: "[CY] Suspended",
        ceased: "[CY] Ceased",

        // From MembershipStatus enum
        removed: "[CY] Removed",

        // Appears in both AcspStatus and MembershipStatus enums
        active: "[CY] Active"
    }
};

export const translateEnum = (locale: string) => {
    return (value: UserRole | AcspStatus | MembershipStatus): string => {
        const translationMap = translations[locale as keyof typeof translations] || translations.en;
        return translationMap[value] || value;
    };
};
