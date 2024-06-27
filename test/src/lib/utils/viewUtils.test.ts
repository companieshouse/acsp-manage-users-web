import { getLink } from "../../../../src/lib/utils/viewUtils";

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
