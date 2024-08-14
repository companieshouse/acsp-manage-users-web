import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { buildPaginationElement, getCurrentPageNumber, stringToPositiveInteger } from "../../../../src/lib/helpers/buildPaginationHelper";
import { PageNumbers } from "../../../../src/types/utilTypes";
import { PaginationData } from "../../../../src/types/pagination";

describe("stringToPositiveInteger", () => {
    it.each([
        // Given
        [undefined!, 1],
        [null!, 1],
        ["NaN", 1],
        ["rubbish", 1],
        ["-3894", 1],
        ["-1", 1],
        ["0", 1],
        ["1", 1],
        ["2", 2],
        ["5", 5],
        ["384725", 384725]
    ])("should return expected numerical value", (pageNumber, expectedPageNumber) => {
        // When
        const result = stringToPositiveInteger(pageNumber);
        // Then
        expect(result).toEqual(expectedPageNumber);
    });
});

describe("getCurrentPageNumber", () => {
    const pageNumbers: PageNumbers = {
        ownerPage: 3,
        adminPage: 27,
        standardPage: 1
    };

    it.each([
        // Given
        [pageNumbers, UserRole.OWNER, 3],
        [pageNumbers, UserRole.ADMIN, 27],
        [pageNumbers, UserRole.STANDARD, 1]
    ])("should return expected numerical value", (pageNumbers, userRole, expectedPageNumber) => {
        // When
        const result = getCurrentPageNumber(pageNumbers, userRole);
        // Then
        expect(result).toEqual(expectedPageNumber);
    });
});

describe("buildPaginationElement", () => {

    const getPageNumbers = (
        ownerPage: number,
        adminPage: number,
        standardPage: number
    ): PageNumbers => {
        return {
            ownerPage,
            adminPage,
            standardPage
        };
    };

    it.each([
        // Given
        [0, getPageNumbers(1, 1, 1), UserRole.OWNER],
        [1, getPageNumbers(1, 1, 1), UserRole.OWNER]
    ])("should return empty pagination data if the number of pages is %s",
        (numberOfPages, pageNumbers, userRole) => {
            const expectedPagination: PaginationData = { items: [] };
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "");
            // Then
            expect(result).toEqual(expectedPagination);
        });

    it("should return empty pagination data if the page number for the user is less than 1", () => {
        const pageNumbers = getPageNumbers(1, 1, 0);
        const userRole = UserRole.STANDARD;
        const numberOfPages = 5;
        const expectedPagination: PaginationData = { items: [] };
        // When
        const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "");
        // Then
        expect(result).toEqual(expectedPagination);
    });
});
