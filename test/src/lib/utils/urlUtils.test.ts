import {
    isWhitelistedUrl
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
