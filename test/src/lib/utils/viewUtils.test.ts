import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getHiddenText, getLink, getUserRoleTag } from "../../../../src/lib/utils/viewUtils";

describe("getLink", () => {
    it("should return a link when href and text provided", () => {
        // Given
        const href = "/unit/test";
        const displayText = "Click me";
        const expectedLink = "<a href=\"/unit/test\">Click me</a>";
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
