import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { addErrorToViewData, getHiddenText, getLink, getUserRoleTag } from "../../../../src/lib/utils/viewUtils";
import { ViewData } from "../../../../src/types/utilTypes";

describe("getLink", () => {
    it("should return a link when href and text provided", () => {
        // Given
        const href = "/unit/test";
        const displayText = "Click me";
        const expectedLink = "<a data-event-id=\"remove\" href=\"/unit/test\">Click me</a>";
        // When
        const result = getLink(href, displayText);
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
        const viewDataOriginal: ViewData = {
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
        const viewDataOriginal: ViewData = {
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
    it("should return an unmodified user role tag text when user role provided and isLowerCase false", () => {
        // Given
        const userRole = UserRole.ADMIN;
        const expectedDisplayText = "Administrator";
        // When
        const result = getUserRoleTag(userRole, false);
        // Then
        expect(result).toEqual(expectedDisplayText);
    });

    it("should return a user role tag text in lower case when user role provided and isLowerCase true", () => {
        // Given
        const userRole = UserRole.ADMIN;
        const expectedDisplayText = "administrator";
        // When
        const result = getUserRoleTag(userRole, true);
        // Then
        expect(result).toEqual(expectedDisplayText);
    });
});
