import { isValidRole, validateRole } from "../../../../src/lib/validation/user.role.validation";
import * as constants from "../../../../src/lib/constants";

describe("validateRole", () => {
    it.each([
        // Given
        [undefined, "owner"],
        [undefined, "admin"],
        [undefined, "standard"],
        [constants.ERRORS_SELECT_USER_ROLE, ""],
        [constants.ERRORS_SELECT_USER_ROLE, "something else"],
        [constants.ERRORS_SELECT_USER_ROLE, undefined]
    ])("should return %s when provided role is '%s'", (expected, role) => {
        // When
        const result = validateRole(role);
        // Then
        expect(result).toEqual(expected);
    });
});

describe("isValidRole", () => {
    it.each([
        // Given
        [true, "owner"],
        [true, "admin"],
        [true, "standard"],
        [false, ""],
        [false, "something else"],
        [false, undefined]
    ])("should return %s when provided role is '%s'", (expected, role) => {
        // When
        const result = isValidRole(role);
        // Then
        expect(result).toEqual(expected);
    });
});
