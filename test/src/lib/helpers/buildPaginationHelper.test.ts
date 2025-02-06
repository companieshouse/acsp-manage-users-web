import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { buildPaginationElement, getCurrentPageNumber, stringToPositiveInteger } from "../../../../src/lib/helpers/buildPaginationHelper";
import { PageNumbers } from "../../../../src/types/utilTypes";
import { PaginationData } from "../../../../src/types/pagination";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";

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
        [0, UserRole.OWNER, "English", enCommon, getPageNumbers(1, 1, 1)],
        [0, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(1, 1, 1)],
        [1, UserRole.OWNER, "English", enCommon, getPageNumbers(1, 1, 1)],
        [1, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(1, 1, 1)],
        [0, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 1, 1)],
        [0, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 1, 1)],
        [1, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 1, 1)],
        [1, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 1, 1)],
        [0, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 1)],
        [0, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 1)],
        [1, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 1)],
        [1, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 1)]
    ])("should return empty pagination data if the number of pages is %s for user with role %s and the language set to %s",
        (numberOfPages, userRole, _langInfo, lang, pageNumbers) => {
            const expectedPagination: PaginationData = {
                items: [],
                landmarkLabel: lang.page
            };
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "", lang);
            // Then
            expect(result).toEqual(expectedPagination);
        });

    it.each([
        // Given
        [0, UserRole.OWNER, "English", enCommon, getPageNumbers(0, 1, 1)],
        [0, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(0, 1, 1)],
        [-1, UserRole.OWNER, "English", enCommon, getPageNumbers(-1, 1, 1)],
        [-1, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(-1, 1, 1)],
        [0, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 0, 1)],
        [0, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 0, 1)],
        [-1, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, -1, 1)],
        [-1, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, -1, 1)],
        [0, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 0)],
        [0, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 0)],
        [-1, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, -1)],
        [-1, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, -1)]
    ])("should return empty pagination data if the page number is %s for the user with role %s and the language set to %s",
        (_pageNumber, userRole, _langInfo, lang, pageNumbers) => {
            const numberOfPages = 5;
            const expectedPagination: PaginationData = {
                items: [],
                landmarkLabel: lang.page
            };
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "", lang);
            // Then
            expect(result).toEqual(expectedPagination);
        });

    it.each([
        // Given
        [5, 5, UserRole.OWNER, "English", enCommon, getPageNumbers(5, 1, 1), 1],
        [5, 5, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(5, 1, 1), 1],
        [5, 6, UserRole.OWNER, "English", enCommon, getPageNumbers(5, 1, 1), 1],
        [5, 6, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(5, 1, 1), 1],
        [6, 6, UserRole.OWNER, "English", enCommon, getPageNumbers(6, 1, 1), 1],
        [6, 6, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(6, 1, 1), 1],
        [1, 5, UserRole.OWNER, "English", enCommon, getPageNumbers(1, 1, 1), 2],
        [1, 5, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(1, 1, 1), 2],
        [11, 60, UserRole.OWNER, "English", enCommon, getPageNumbers(11, 1, 1), 1],
        [11, 60, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(11, 1, 1), 1],
        [11, 60, UserRole.OWNER, "English", enCommon, getPageNumbers(11, 1, 1), 5],
        [11, 60, UserRole.OWNER, "Welsh", cyCommon, getPageNumbers(11, 1, 1), 5],
        [5, 5, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 5, 1), 1],
        [5, 5, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 5, 1), 1],
        [5, 6, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 5, 1), 1],
        [5, 6, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 5, 1), 1],
        [6, 6, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 6, 1), 1],
        [6, 6, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 6, 1), 1],
        [1, 5, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 1, 1), 2],
        [1, 5, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 1, 1), 2],
        [11, 50, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 11, 1), 1],
        [11, 50, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 11, 1), 1],
        [11, 50, UserRole.ADMIN, "English", enCommon, getPageNumbers(1, 11, 1), 5],
        [11, 50, UserRole.ADMIN, "Welsh", cyCommon, getPageNumbers(1, 11, 1), 5],
        [5, 5, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 5), 1],
        [5, 5, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 5), 1],
        [5, 6, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 5), 1],
        [5, 6, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 5), 1],
        [1, 5, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 1), 2],
        [1, 5, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 1), 2],
        [14, 45, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 14), 1],
        [14, 45, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 14), 1],
        [14, 45, UserRole.STANDARD, "English", enCommon, getPageNumbers(1, 1, 14), 5],
        [14, 45, UserRole.STANDARD, "Welsh", cyCommon, getPageNumbers(1, 1, 14), 5]
    ])("should return pagination data containing ellipsis if the page number is %s and the number of pages is %s for the user with role %s and the language set to %s",
        (_pageNumber, numberOfPages, userRole, _langInfo, lang, pageNumbers, elipsisIndex) => {
            // When
            const result = buildPaginationElement(pageNumbers, userRole, numberOfPages, "", "", lang);
            // Then
            expect(result.items.length).not.toEqual(0);
            expect(result.items[elipsisIndex].ellipsis).toBeTruthy();
        });
});
