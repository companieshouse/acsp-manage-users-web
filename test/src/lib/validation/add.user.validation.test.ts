import { validateAddUserEmail } from "../../../../src/lib/validation/add.user.validation";
import * as constants from "../../../../src/lib/constants";

describe("validateAddUserEmail", () => {
    test("should return invalid email ", () => {
        expect(validateAddUserEmail("badEmail")).toBe(constants.ERRORS_EMAIL_INVALID);
    });
    test("should return email required", () => {
        expect(validateAddUserEmail("")).toBe(constants.ERRORS_EMAIL_REQUIRED);
    });
});
