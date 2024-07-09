import { addErrorToViewData, validateAddUserEmail } from "../../../../src/lib/validation/add.user.validation";
import { ViewData } from "../../../../src/types/utilTypes";
import * as constants from "../../../../src/lib/constants";

describe("addErrorToViewData", () => {
    test("adds error key and error message to view data object", () => {
        const viewDataOriginal:ViewData = {
            lang: {},
            companyName: "Acme"
        };
        const errorKey = "email";
        const errorMessage = "email_invalid";
        const expectedViewData = {
            lang: {},
            companyName: "Acme",
            errors: {
                email: {
                    text: "email_invalid"
                }
            }
        };
        addErrorToViewData(errorKey, errorMessage, viewDataOriginal);
        expect(viewDataOriginal).toEqual(expectedViewData);
    });
    test("should add error key and error message to view data which already contains an error", () => {
        const viewDataOriginal:ViewData = {
            lang: {},
            companyName: "Acme",
            errors: {
                userRole: {
                    text: "role_required"
                }
            }
        };
        const errorKey = "email";
        const errorMessage = "email_invalid";
        const expectedViewData = {
            lang: {},
            companyName: "Acme",
            errors: {
                email: {
                    text: "email_invalid"
                },
                userRole: {
                    text: "role_required"
                }
            }
        };
        addErrorToViewData(errorKey, errorMessage, viewDataOriginal);
        expect(viewDataOriginal).toEqual(expectedViewData);
    });
});

describe("validateAddUserEmail", () => {
    test("should return invalid email ", () => {
        expect(validateAddUserEmail("badEmail")).toBe(constants.ERRORS_EMAIL_INVALID);
    });
    test("should return email required", () => {
        expect(validateAddUserEmail("")).toBe(constants.ERRORS_EMAIL_REQUIRED);
    });
});
