import { validateAddUserEmail } from "../../../../src/lib/validation/add.user.validation";
import * as constants from "../../../../src/lib/constants";
import { mockRequest } from "../../../mocks/request.mock";

describe("validateAddUserEmail", () => {
    test("should return invalid email ", async () => {
        const request = mockRequest();
        expect(await validateAddUserEmail(request, "badEmail")).toBe(constants.ERRORS_EMAIL_INVALID);
    });

    test("should return email required", async () => {
        const request = mockRequest();
        expect(await validateAddUserEmail(request, "")).toBe(constants.ERRORS_EMAIL_REQUIRED);
    });
});
