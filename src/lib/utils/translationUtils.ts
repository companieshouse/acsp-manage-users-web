import i18next from "i18next";
import { AnyRecord } from "../../types/utilTypes";
import * as constants from "../constants";
import {
    AcspStatus,
    MembershipStatus,
    UserRole
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import {
    SHARED_NUNJUCKS_TRANSLATION_NAMESPACES
} from "@companieshouse/ch-node-utils/lib/constants/constants";
import { i18nCh } from "@companieshouse/ch-node-utils";

export const getTranslationsForView = (lang: string, viewName: string): AnyRecord => {
    return [...SHARED_NUNJUCKS_TRANSLATION_NAMESPACES, constants.COMMON, viewName].reduce(
        (acc, ns) => ({
            ...acc,
            ...i18nCh.getInstance().getResourceBundle(lang, ns)
        }),
        {}
    );
};

const translations = {
    en: {
        // From UserRole enum
        owner: "Owner",
        admin: "Administrator",
        standard: "Standard",

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
        standard: "[CY] Standard",

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
