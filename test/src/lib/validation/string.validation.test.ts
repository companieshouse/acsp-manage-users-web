import * as constants from "../../../../src/lib/constants";
import { validateActiveTabId } from "../../../../src/lib/validation/string.validation";

describe("validateActiveTabId", () => {
    it.each([
        constants.ACCOUNT_OWNERS_TAB_ID,
        constants.ADMINISTRATORS_TAB_ID,
        constants.STANDARD_USERS_TAB_ID
    ])("should return true if active tab id is correct", (activeTabId) => {
        // When
        const result = validateActiveTabId(activeTabId);
        // Then
        expect(result).toBeTruthy();
    });

    it("should return false if active tab id is not correct", () => {
        // Given
        const activeTabId = "something else";
        // When
        const result = validateActiveTabId(activeTabId);
        // Then
        expect(result).toBeFalsy();
    });
});
