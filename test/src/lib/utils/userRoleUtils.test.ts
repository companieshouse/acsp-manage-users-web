import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import {
    convertUserRole, UserRoleMatomoFormat
} from "../../../../src/lib/utils/userRoleUtils";

describe("convertUserRole", () => {
    it("Should return admin when user is an administrator", () => {
        // Given
        const role = UserRole.ADMIN;
        // When
        const result = convertUserRole(role);
        // Then
        expect(result).toBe(UserRoleMatomoFormat.ADMIN);
    });
    it("Should return standard-user when user is a standard user", () => {
        // Given
        const role = UserRole.STANDARD;
        // When
        const result = convertUserRole(role);
        // Then
        expect(result).toBe(UserRoleMatomoFormat.STANDARD);
    });
    it("Should return account-owner when user is an owner", () => {
        // Given
        const role = UserRole.OWNER;
        // When
        const result = convertUserRole(role);
        // Then
        expect(result).toBe(UserRoleMatomoFormat.OWNER);
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
