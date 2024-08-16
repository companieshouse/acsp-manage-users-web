import * as en from "../../../../src/locales/en/translation/manage-users.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import { AnyRecord } from "../../../../src/types/utilTypes";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getTitle } from "../../../../src/routers/controllers/manageUsersController";

describe("getTitle", () => {
    const allTranslations = {
        ...en,
        ...enCommon
    } as AnyRecord;

    it.each([
        // Given
        [`${enCommon.title_error}${en.page_header}${enCommon.title_end}`, UserRole.OWNER, true, allTranslations],
        [`${enCommon.title_error}${en.page_header}${enCommon.title_end}`, UserRole.ADMIN, true, allTranslations],
        [`${enCommon.title_error}${en.page_header_standard}${enCommon.title_end}`, UserRole.STANDARD, true, allTranslations],
        [`${en.page_header}${enCommon.title_end}`, UserRole.OWNER, false, allTranslations],
        [`${en.page_header}${enCommon.title_end}`, UserRole.ADMIN, false, allTranslations],
        [`${en.page_header_standard}${enCommon.title_end}`, UserRole.STANDARD, false, allTranslations]
    ])("should return text '%s' when user role is '%s' and isError is %s", (expectedText, userRole, isError, translations) => {
        // When
        const result = getTitle(translations, userRole, isError);
        // Then
        expect(result).toEqual(expectedText);
    });
});
