import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import {
    convertUserRole, UserRoleMatomoFormat
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
