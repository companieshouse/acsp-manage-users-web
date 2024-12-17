import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import {
    convertUserRole, getUserRole, UserRoleMatomoFormat
} from "../../../../src/lib/utils/userRoleUtils";

describe("convertUserRole", () => {
    it.each([
        // Given
        [UserRoleMatomoFormat.ADMIN, UserRole.ADMIN],
        [UserRoleMatomoFormat.STANDARD, UserRole.STANDARD],
        [UserRoleMatomoFormat.OWNER, UserRole.OWNER]
    ])("Should return %s when user is %s", (expected, userRole) => {
        // When
        const result = convertUserRole(userRole);
        // Then
        expect(result).toBe(expected);
    });

    it("Should return default empty string if not match found", () => {
        // Given
        const role = "";
        // When
        const result = convertUserRole(role as UserRole);
        // Then
        expect(result).toBe("");
    });
});

describe("getUserRole", () => {
    it.each([
        // Given
        [UserRole.ADMIN, "admin"],
        [UserRole.OWNER, "owner"],
        [UserRole.STANDARD, "standard"]
    ])("Should return %s when the requested user role is %s", (expectedUserRole, requestedUserRole) => {
        // When
        const result = getUserRole(requestedUserRole);
        // Then
        expect(result).toEqual(expectedUserRole);
    });

    it.each([
        "", undefined, null, "something else"
    ])("Should throw an error if the requested role '%s' doesn't exist", (param) => {
        expect(() => getUserRole(param!)).toThrow(`A user role ${param} does not exist.`);
    });
});
