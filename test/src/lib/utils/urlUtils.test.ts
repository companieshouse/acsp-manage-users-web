import {
    isWhitelistedUrl,
    getRemoveMemberCheckDetailsFullUrl,
    getChangeMemberRoleFullUrl
} from "../../../../src/lib/utils/urlUtils";

describe("isWhitelistedUrl", () => {
    it("Should return true when url in the allow list", () => {
        // Given
        const url = "/authorised-agent/healthcheck";
        // When
        const result = isWhitelistedUrl(url);
        // Then
        expect(result).toBeTruthy();
    });

    it("Should return false when url is not in the allow list", () => {
        // Given
        const url = "/authorised-agent/healthcheckbad";
        // When
        const result = isWhitelistedUrl(url);
        // Then
        expect(result).toBeFalsy();
    });

    it("Should return false when url is not an exact match", () => {
        // Given
        const url = "/healthcheck";
        // When
        const result = isWhitelistedUrl(url);
        // Then
        expect(result).toBeFalsy();
    });
});

describe("getRemoveMemberCheckDetailsFullUrl", () => {
    it("Should return the check member details URL with the ID", () => {
        // Given
        const id = "123";
        // When
        const result = getRemoveMemberCheckDetailsFullUrl(id);
        // Then
        expect(result).toEqual("/authorised-agent/remove-member/123");
    });

    it("Should return the check member details URL without an ID", () => {
        // Given
        const id = "";
        // When
        const result = getRemoveMemberCheckDetailsFullUrl(id);
        // Then
        expect(result).toEqual("/authorised-agent/remove-member/");
    });
});

describe("getChangeMemberRoleFullUrl", () => {
    it("Should return the change member role URL with the ID", () => {
        // Given
        const id = "123";
        // When
        const result = getChangeMemberRoleFullUrl(id);
        // Then
        expect(result).toEqual("/authorised-agent/edit-member-role/123");
    });

    it("Should return the change member role URL without an ID", () => {
        // Given
        const id = "";
        // When
        const result = getChangeMemberRoleFullUrl(id);
        // Then
        expect(result).toEqual("/authorised-agent/edit-member-role/");
    });
});
