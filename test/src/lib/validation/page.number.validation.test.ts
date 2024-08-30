import { validatePageNumber } from "../../../../src/lib/validation/page.number.validation";

describe("validatePageNumber", () => {
    it.each([
        // Given
        [1, 10],
        [2, 10],
        [5, 10],
        [9, 10],
        [10, 10]
    ])("should return true if page number between 1 and maximum number of pages, border values included",
        (pageNum, maxNumOfPages) => {
            // When
            const result = validatePageNumber(pageNum, maxNumOfPages);
            // Then
            expect(result).toBeTruthy();
        });

    it.each([
        // Given
        [0, 10],
        [11, 10],
        [20, 10],
        [undefined!, 10]
    ])("should return false if page number outside 1 and maximum number of pages range",
        (pageNum, maxNumOfPages) => {
            // When
            const result = validatePageNumber(pageNum, maxNumOfPages);
            // Then
            expect(result).toBeFalsy();
        });
});
