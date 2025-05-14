import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { addErrorToViewData, getHiddenText, getLink, getStatusTag, getUserRoleTag } from "../../../../src/lib/utils/viewUtils";
import { UserRoleTagCy, UserRoleTagEn } from "../../../../src/types/userRoleTagEn";
describe("getLink", () => {
    it("should return a link when href and text provided", () => {
        // Given
        const href = "/unit/test";
        const displayText = "Click me";
        const expectedLink = "<a data-event-id=\"remove\" href=\"/unit/test\">Click me</a>";
        // When
        const result = getLink(href, displayText, "remove");
        // Then
        expect(result).toEqual(expectedLink);
    });
});
describe("getHiddenText", () => {
    it("should return a hidden text when arguments provided", () => {
        // Given
        const hiddenText = "Mr Brown";
        const expectedDisplayText = "<span class=\"govuk-visually-hidden\">Mr Brown</span>";
        // When
        const result = getHiddenText(hiddenText);
        // Then
        expect(result).toEqual(expectedDisplayText);
    });
});
describe("addErrorToViewData", () => {
    test("adds error key and error message to view data object", () => {
        const viewDataOriginal = {
            lang: {},
            companyName: "Acme",
            templateName: "template"
        };
        const errorKey = "email";
        const errorMessage = "email_invalid";
        const expectedViewData = {
            lang: {},
            companyName: "Acme",
            templateName: "template",
            errors: {
                email: {
                    text: "email_invalid"
                }
            }
        };
        addErrorToViewData(errorKey, errorMessage, viewDataOriginal);
        expect(viewDataOriginal).toEqual(expectedViewData);
    });
    test("should add error key and error message to view data which already contains an error", () => {
        const viewDataOriginal = {
            lang: {},
            companyName: "Acme",
            templateName: "template",
            errors: {
                userRole: {
                    text: "role_required"
                }
            }
        };
        const errorKey = "email";
        const errorMessage = "email_invalid";
        const expectedViewData = {
            lang: {},
            companyName: "Acme",
            templateName: "template",
            errors: {
                email: {
                    text: "email_invalid"
                },
                userRole: {
                    text: "role_required"
                }
            }
        };
        addErrorToViewData(errorKey, errorMessage, viewDataOriginal);
        expect(viewDataOriginal).toEqual(expectedViewData);
    });
});
describe("getUserRoleTag", () => {
    const testCases = [
        { userRole: UserRole.OWNER, locale: "en", isLowerCase: false, expected: UserRoleTagEn.OWNER },
        { userRole: UserRole.ADMIN, locale: "en", isLowerCase: false, expected: UserRoleTagEn.ADMIN },
        { userRole: UserRole.STANDARD, locale: "en", isLowerCase: false, expected: UserRoleTagEn.STANDARD },
        { userRole: UserRole.OWNER, locale: "cy", isLowerCase: false, expected: UserRoleTagCy.OWNER },
        { userRole: UserRole.ADMIN, locale: "cy", isLowerCase: false, expected: UserRoleTagCy.ADMIN },
        { userRole: UserRole.STANDARD, locale: "cy", isLowerCase: false, expected: UserRoleTagCy.STANDARD },
        { userRole: UserRole.OWNER, locale: "en", isLowerCase: true, expected: UserRoleTagEn.OWNER.toLowerCase() },
        { userRole: UserRole.ADMIN, locale: "cy", isLowerCase: true, expected: UserRoleTagCy.ADMIN.toLowerCase() },
        { userRole: UserRole.STANDARD, locale: "fr", isLowerCase: false, expected: UserRoleTagEn.STANDARD }, // fallback to 'en'
        { userRole: UserRole.OWNER, locale: "fr", isLowerCase: true, expected: UserRoleTagEn.OWNER.toLowerCase() } // fallback to 'en' and lowercase
    ];
    test.each(testCases)("returns correct tag for role: $userRole, locale: $locale, isLowerCase: $isLowerCase",
        ({ userRole, locale, isLowerCase, expected }) => {
            const result = getUserRoleTag(userRole, locale, isLowerCase);
            expect(result).toEqual(expected);
        }
    );
});
describe("getStatusTag", () => {
    const testCases = [
        { status: "active", translations: { active: "active" }, expected: `<strong class="govuk-tag govuk-tag--green">Active</strong>` },
        { status: "pending", translations: { pending: "pending" }, expected: `<strong class="govuk-tag govuk-tag--yellow">Pending</strong>` },
        { status: "removed", translations: { removed: "removed" }, expected: `<strong class="govuk-tag govuk-tag--red">Removed</strong>` },
        { status: "random", translations: { random: "random" }, expected: `<strong class="govuk-tag govuk-tag--grey">Random</strong>` }
    ];
    test.each(testCases)("returns correct tag for membership status: $status",
        ({ status, translations, expected }) => {
            const result = getStatusTag(status, translations[status]);
            expect(result).toEqual(expected);
        });
});
