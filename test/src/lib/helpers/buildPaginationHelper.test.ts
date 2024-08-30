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
        [0, UserRole.OWNER, getPageNumbers(1, 1, 1)],
        [1, UserRole.OWNER, getPageNumbers(1, 1, 1)],
        [0, UserRole.ADMIN, getPageNumbers(1, 1, 1)],
        [1, UserRole.ADMIN, getPageNumbers(1, 1, 1)],
        [0, UserRole.STANDARD, getPageNumbers(1, 1, 1)],
        [1, UserRole.STANDARD, getPageNumbers(1, 1, 1)]
    ])("should return empty pagination data if the number of pages is %s for user with role %s",
        (numberOfPages, userRole, pageNumbers) => {
            const expectedPagination: PaginationData = { items: [] };
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "");
            // Then
            expect(result).toEqual(expectedPagination);
        });

    it.each([
        // Given
        [0, UserRole.OWNER, getPageNumbers(0, 1, 1)],
        [-1, UserRole.OWNER, getPageNumbers(-1, 1, 1)],
        [0, UserRole.ADMIN, getPageNumbers(1, 0, 1)],
        [-1, UserRole.ADMIN, getPageNumbers(1, -1, 1)],
        [0, UserRole.STANDARD, getPageNumbers(1, 1, 0)],
        [-1, UserRole.STANDARD, getPageNumbers(1, 1, -1)]
    ])("should return empty pagination data if the page number is %s for the user with role %s",
        (_pageNumber, userRole, pageNumbers) => {
            const numberOfPages = 5;
            const expectedPagination: PaginationData = { items: [] };
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "");
            // Then
            expect(result).toEqual(expectedPagination);
        });

    it.each([
        // Given
        [5, 5, UserRole.OWNER, getPageNumbers(5, 1, 1), 1],
        [5, 6, UserRole.OWNER, getPageNumbers(5, 1, 1), 1],
        [6, 6, UserRole.OWNER, getPageNumbers(6, 1, 1), 1],
        [1, 5, UserRole.OWNER, getPageNumbers(1, 1, 1), 2],
        [11, 60, UserRole.OWNER, getPageNumbers(11, 1, 1), 1],
        [11, 60, UserRole.OWNER, getPageNumbers(11, 1, 1), 5],
        [5, 5, UserRole.ADMIN, getPageNumbers(1, 5, 1), 1],
        [5, 6, UserRole.ADMIN, getPageNumbers(1, 5, 1), 1],
        [6, 6, UserRole.ADMIN, getPageNumbers(1, 6, 1), 1],
        [1, 5, UserRole.ADMIN, getPageNumbers(1, 1, 1), 2],
        [11, 50, UserRole.ADMIN, getPageNumbers(1, 11, 1), 1],
        [11, 50, UserRole.ADMIN, getPageNumbers(1, 11, 1), 5],
        [5, 5, UserRole.STANDARD, getPageNumbers(1, 1, 5), 1],
        [5, 6, UserRole.STANDARD, getPageNumbers(1, 1, 5), 1],
        [1, 5, UserRole.STANDARD, getPageNumbers(1, 1, 1), 2],
        [14, 45, UserRole.STANDARD, getPageNumbers(1, 1, 14), 1],
        [14, 45, UserRole.STANDARD, getPageNumbers(1, 1, 14), 5]
    ])("should return pagination data containing ellipsis if the page number is %s and the number of pages is %s for the user with role %s",
        (_pageNumber, numberOfPages, userRole, pageNumbers, elipsisIndex) => {
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "");
            // Then
            expect(result.items.length).not.toEqual(0);
            expect(result.items[elipsisIndex].ellipsis).toBeTruthy();
        });
});
