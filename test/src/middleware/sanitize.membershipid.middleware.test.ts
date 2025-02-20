
import { sanitizeMembershipIdMiddleware } from "../../../src/middleware/sanitize.membership.id.middleware";
import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";

describe("sanitizeMembershipIdMiddleware", () => {
    it.each([
        ["id123", "id123"],
        ["  id with space", "idwithspace"],
        ["id?-with-£-special-*-chars-", "idwithspecialchars"],
        ["CAPS REMAIN", "CAPSREMAIN"],
        ["12", "12"],
        ["((%?))", ""],
        ["123-bnc2-23df", "123bnc223df"]
    ])("ID %s should update to %s", (id, updatedId) => {
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();

        request.params.id = id;

        sanitizeMembershipIdMiddleware(request, response, mockedNext);
        // Then
        expect(request.params.id).toEqual(updatedId);
        expect(mockedNext).toHaveBeenCalled();
    });
});
