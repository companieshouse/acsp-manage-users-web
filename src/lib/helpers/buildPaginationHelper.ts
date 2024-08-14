import { PageNumbers } from "../../types/utilTypes";
import { PageItem, PaginationData } from "../../types/pagination";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../constants";

export const stringToPositiveInteger = (pageNumber: string): number => {
    return isNaN(parseInt(pageNumber)) || parseInt(pageNumber) < 1 ? 1 : parseInt(pageNumber);
};

export const buildPaginationElement = (
    pageNumbers: PageNumbers,
    userRole: UserRole,
    numOfPages: number,
    urlPrefix: string,
    activeTabId: string
): PaginationData => {
    const currentPageNumber = getCurrentPageNumber(pageNumbers, userRole);
    const pagination: PaginationData = { items: [] };
    const pageItems: PageItem[] = [];

    if (numOfPages <= 1 || currentPageNumber < 1) return pagination;

    // Add Previous and Next
    if (currentPageNumber > 1) {
        pagination.previous = {
            href: createHref(urlPrefix, pageNumbers, userRole, -1, activeTabId)
        };
    }
    if (currentPageNumber !== numOfPages) {
        pagination.next = {
            href: createHref(urlPrefix, pageNumbers, userRole, +1, activeTabId)
        };
    }

    // Add first element by default
    pageItems.push(
        createPageItem(1, pageNumbers, userRole, false, urlPrefix, activeTabId)
    );

    // Add second element if applicable - possible ellipsis
    if (numOfPages >= 3) {
        const isEllipsis = numOfPages >= 5 && currentPageNumber >= 5;
        pageItems.push(
            createPageItem(2, pageNumbers, userRole, isEllipsis, urlPrefix, activeTabId)
        );
    }

    // Add element at middle left position if applicable
    if (
        numOfPages >= 5 &&
        currentPageNumber >= 4 &&
        numOfPages - currentPageNumber >= 1
    ) {
        pageItems.push(
            createPageItem(
                currentPageNumber - 1,
                pageNumbers,
                userRole,
                false,
                urlPrefix,
                activeTabId
            )
        );
    }

    // Add element at middle position if applicable
    if (
        numOfPages >= 5 &&
        currentPageNumber >= 3 &&
        numOfPages - currentPageNumber >= 2
    ) {
        pageItems.push(
            createPageItem(
                currentPageNumber,
                pageNumbers,
                userRole,
                false,
                urlPrefix,
                activeTabId
            )
        );
    }

    // Add element at middle right position if applicable
    if (
        numOfPages >= 5 &&
        currentPageNumber >= 2 &&
        numOfPages - currentPageNumber >= 3
    ) {
        pageItems.push(
            createPageItem(
                currentPageNumber + 1,
                pageNumbers,
                userRole,
                false,
                urlPrefix,
                activeTabId
            )
        );
    }

    // Add second-to-last element if applicable - possible ellipsis
    if (numOfPages >= 4) {
        const isEllipsis = numOfPages >= 5 && numOfPages - currentPageNumber >= 4;
        pageItems.push(
            createPageItem(
                numOfPages - 1,
                pageNumbers,
                userRole,
                isEllipsis,
                urlPrefix,
                activeTabId
            )
        );
    }

    // Add last element if applicable
    if (numOfPages > 1) {
        pageItems.push(
            createPageItem(
                numOfPages,
                pageNumbers,
                userRole,
                false,
                urlPrefix,
                activeTabId
            )
        );
    }

    pagination.items = pageItems;
    return pagination;
};

export const getCurrentPageNumber = (pageNumbers: PageNumbers, userRole: UserRole): number => {
    switch (userRole) {
    case UserRole.OWNER:
        return pageNumbers.ownerPage;
    case UserRole.ADMIN:
        return pageNumbers.adminPage;
    case UserRole.STANDARD:
        return pageNumbers.standardPage;
    }
};

const createPageItem = (
    pageNumber: number,
    pageNumbers: PageNumbers,
    userRole: UserRole,
    isEllipsis: boolean,
    prefix: string,
    activeTabId: string
): PageItem => {
    if (isEllipsis) {
        return {
            ellipsis: true
        };
    }
    const currentPageNumber = getCurrentPageNumber(pageNumbers, userRole);
    return {
        current: currentPageNumber === pageNumber,
        number: pageNumber,
        href: createHref(prefix, pageNumbers, userRole, 0, activeTabId, pageNumber)
    };
};

const createHref = (prefix: string, pageNumbers: PageNumbers, userRole: UserRole, changeParam: number, activeTabId: string, pageNumber?: number): string => {
    let href = `${prefix}?`;
    let firstIteration = true;
    for (const [key, value] of Object.entries(pageNumbers)) {
        if (firstIteration) {
            href = `${href}${getPageNumberQueryParam(key, value, userRole, changeParam, pageNumber)}`;
            firstIteration = false;
        } else {
            href = `${href}&${getPageNumberQueryParam(key, value, userRole, changeParam, pageNumber)}`;
        }
    }

    return `${href}&activeTabId=${activeTabId}`;
};

const getPageNumberQueryParam = (key: string, value: number, userRole: UserRole, changeParam: number, pageNumber?: number): string => {
    let queryParam = "";
    switch (key) {
    case constants.OWNER_PAGE_QUERY_PARAM:
        queryParam = userRole === UserRole.OWNER ? getQueryString(key, (pageNumber || value) + changeParam) : getQueryString(key, value);
        break;
    case constants.ADMIN_PAGE_QUERY_PARAM:
        queryParam = userRole === UserRole.ADMIN ? getQueryString(key, (pageNumber || value) + changeParam) : getQueryString(key, value);
        break;
    case constants.STANDARD_PAGE_QUERY_PARAM:
        queryParam = userRole === UserRole.STANDARD ? getQueryString(key, (pageNumber || value) + changeParam) : getQueryString(key, value);
        break;
    }
    return queryParam;
};

const getQueryString = (key: string, value: number): string => `${key}=${value}`;
