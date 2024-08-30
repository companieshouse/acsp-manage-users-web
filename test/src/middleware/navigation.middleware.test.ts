import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";
import { navigationMiddleware } from "../../../src/middleware/navigationMiddleware";

describe("navigiationMiddleware", () => {

    it("should allow request when check member details page is redirecting", () => {
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/check-member-details";
        request.headers.referer = "/authorised-agent/add-user";
        navigationMiddleware(request, response, mockedNext);
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should not allow check member details request to redirect", () => {
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/check-member-details";
        request.headers.referer = "/authorised-agent/confirmation-you-are-removed";
        navigationMiddleware(request, response, mockedNext);
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });
});
