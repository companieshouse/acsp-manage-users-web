
import * as constants from "../../../../src/lib/constants";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getDisplayNameOrEmail, getDisplayNameOrLangKeyForNotProvided } from "../../../../src/lib/utils/userDisplayUtils";

describe("getDisplayNameOrEmail", () => {
    test.each([
        [{ userDisplayName: "John Doe", userEmail: "john@example.com" }, "John Doe"],
        [{ userDisplayName: null, userEmail: "jane@example.com" }, "jane@example.com"],
        [{ userDisplayName: constants.NOT_PROVIDED, userEmail: "bob@example.com" }, "bob@example.com"],
        [{ userDisplayName: "", userEmail: "empty@example.com" }, "empty@example.com"]
    ])("returns correct display name or email for %p", (member, expected) => {
        expect(getDisplayNameOrEmail(member as AcspMembership)).toBe(expected);
    });
});

describe("getDisplayNameOrNotProvided", () => {
    test.each([
        ["en", { userDisplayName: "Alice Smith" }, "Alice Smith"],
        ["en", { userDisplayName: constants.NOT_PROVIDED }, constants.LANG_KEY_FOR_NOT_PROVIDED],
        ["cy", { userDisplayName: "Bob Jones" }, "Bob Jones"],
        ["cy", { userDisplayName: constants.NOT_PROVIDED }, constants.LANG_KEY_FOR_NOT_PROVIDED],
        ["fr", { userDisplayName: constants.NOT_PROVIDED }, constants.LANG_KEY_FOR_NOT_PROVIDED] // Test with a different locale
    ])("returns correct display name or \"Not Provided\" for locale %s and member %p", (locale, member, expected) => {
        expect(getDisplayNameOrLangKeyForNotProvided(member as AcspMembership)).toBe(expected);
    });
});
