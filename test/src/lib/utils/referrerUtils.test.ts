import { redirectPage } from "../../../../src/lib/utils/referrerUtils";

describe("redirectPage", () => {

    const hrefA = "hrefA.com";
    const hrefB = "hrefB.com";
    const referrer = "referrer.com";

    it("should return false if both urls are equal after function executes", () => {
        // Given
        const urlWithSlash = "testUrl.com/";
        const urlWithoutSlash = "testUrl.com";
        // When
        const result = redirectPage(urlWithSlash, urlWithoutSlash, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when the referrer equals hrefA parameter", () => {
        // Given
        const referrer = "hrefA.com";
        const hrefA = "hrefA.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when the referrer equals hrefB parameter", () => {
        // Given
        const referrer = "hrefB.com";
        const hrefB = "hrefB.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefA but with a query parameter", () => {
        // Given
        const referrer = "hrefA.com?language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefB but with a query parameter", () => {
        // Given
        const referrer = "hrefB.com?language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefA but with an ampersand (&)", () => {
        // Given
        const referrer = "hrefA.com&language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefB but with an ampersand (&)", () => {
        // Given
        const referrer = "hrefB.com&language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(false);
    });

    it("should return true if the referrer parameter is undefined", () => {
        // Given
        const referrer = undefined;
        // When
        const result = redirectPage(referrer, hrefA, hrefB);
        // Then
        expect(result).toEqual(true);
    });
});
