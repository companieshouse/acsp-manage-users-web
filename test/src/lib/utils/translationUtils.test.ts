import {
    AcspStatus,
    MembershipStatus,
    UserRole
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { translateEnum } from "../../../../src/lib/utils/translationUtils";

describe("translateEnum", () => {
    const testCases = [
        // English translations
        { locale: "en", value: UserRole.OWNER, expected: "Owner" },
        { locale: "en", value: UserRole.ADMIN, expected: "Administrator" },
        { locale: "en", value: UserRole.STANDARD, expected: "Standard" },
        { locale: "en", value: AcspStatus.SUSPENDED, expected: "Suspended" },
        { locale: "en", value: AcspStatus.CEASED, expected: "Ceased" },
        { locale: "en", value: MembershipStatus.REMOVED, expected: "Removed" },
        { locale: "en", value: AcspStatus.ACTIVE, expected: "Active" },
        { locale: "en", value: MembershipStatus.ACTIVE, expected: "Active" },

        // Welsh translations
        { locale: "cy", value: UserRole.OWNER, expected: "[CY] Owner" },
        { locale: "cy", value: UserRole.ADMIN, expected: "[CY] Administrator" },
        { locale: "cy", value: UserRole.STANDARD, expected: "[CY] Standard" },
        { locale: "cy", value: AcspStatus.SUSPENDED, expected: "Wedi’i atal" },
        { locale: "cy", value: AcspStatus.CEASED, expected: "[CY] Ceased" },
        { locale: "cy", value: MembershipStatus.REMOVED, expected: "[CY] Removed" },
        { locale: "cy", value: AcspStatus.ACTIVE, expected: "Gweithredol" },
        { locale: "cy", value: MembershipStatus.ACTIVE, expected: "Gweithredol" },

        // Fallback to English for unknown locale
        { locale: "fr", value: UserRole.OWNER, expected: "Owner" },
        { locale: "de", value: AcspStatus.SUSPENDED, expected: "Suspended" },

        // Fallback to original value for unknown enum value
        { locale: "en", value: "UNKNOWN" as any, expected: "UNKNOWN" },
        { locale: "cy", value: "UNKNOWN" as any, expected: "UNKNOWN" }
    ];

    test.each(testCases)(
        "translates $value to $expected for locale $locale",
        ({ locale, value, expected }) => {
            const translate = translateEnum(locale);
            expect(translate(value)).toBe(expected);
        }
    );
});
