import { ViewData } from "../../types/utilTypes";

export const getLink = (href: string, displayText: string): string => {
    return `<a href="${href}">${displayText}</a>`;
};

export const getHiddenText = (hiddenText: string): string => {
    return `<span class="govuk-visually-hidden">${hiddenText}</span>`;
};

export const addErrorToViewData = (
    errProp: string,
    errorMsg: string,
    viewData: ViewData
): void => {
    viewData.errors = {
        ...viewData.errors,
        [errProp]: {
            text: errorMsg
        }
    };
};
