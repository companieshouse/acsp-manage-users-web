import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";
import { navigationMiddleware } from "../../../src/middleware/navigationMiddleware";
import * as sessionUtils from "../../../src/lib/utils/sessionUtils";
import { InvalidAcspNumberError } from "@companieshouse/web-security-node";

describe("navigiationMiddleware", () => {
    const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
    const adminUser = {
        id: "123;",
        userId: "123",
        userRole: "admin",
        acspNumber: "123",
        acspName: "companyName"
    };
    const standardUser = {
        id: "123;",
        userId: "123",
        userRole: "standard",
        acspNumber: "123",
        acspName: "companyName"
    };
    it("should call next when the navigation does not exist", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();

        request.originalUrl = "/authorised-agent/add-account-owner";
        request.headers.referer = "/authorised-agent/add-user";

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should allow admin user to check member details page when add a user is the referer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();

        request.originalUrl = "/authorised-agent/check-member-details";
        request.headers.referer = "/authorised-agent/add-user";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the check member details", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/check-member-details";
        request.headers.referer = "/authorised-agent/confirmation-you-are-removed";
        getExtraDataSpy.mockReturnValueOnce(undefined);
        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });

    it("should allow request to user added success page when check member details is the referer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-member-added";
        request.headers.referer = "/authorised-agent/check-member-details";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);
        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the confirmation member added", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-member-added";
        request.headers.referer = "/authorised-agent/confirmation-you-are-removed";
        getExtraDataSpy.mockReturnValueOnce(undefined);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });

    it("should allow request to remove member page when the remove member is the referer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/remove-member/123";
        request.headers.referer = "/authorised-agent/remove-member/123";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);
        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the remove member added", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/remove-member/123";
        request.headers.referer = "/authorised-agent/confirmation-member-removed";
        getExtraDataSpy.mockReturnValueOnce(undefined);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });

    it("should allow request to remove success page when remove member is the refferer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-member-removed";
        request.headers.referer = "/authorised-agent/remove-member/123";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the confirmation member removed", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-member-removed";
        request.headers.referer = "/authorised-agent/cannot";
        getExtraDataSpy.mockReturnValueOnce(undefined);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });

    it("should allow request to remove yourself success page when remove member is the referer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-you-are-removed";
        request.headers.referer = "/authorised-agent/remove-member/123";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the confirmation member removed", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-member-removed";
        request.headers.referer = "/authorised-agent/cannot";
        getExtraDataSpy.mockReturnValueOnce(undefined);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });

    it("should allow request to cannot add user page is when the check member details is the referer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/cannot-add-user";
        request.headers.referer = "/authorised-agent/check-member-details";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the cannot add a user page", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/cannot-add-user";
        request.headers.referer = "/authorised-agent/cannot";
        getExtraDataSpy.mockReturnValueOnce(undefined);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });

    it("should allow request to stop page account owner when the remove member is the referer", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/stop-page-add-account-owner";
        request.headers.referer = "/authorised-agent/remove-member/123";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(adminUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).toHaveBeenCalled();
    });

    it("should redirect when referer is not in the allowed list for the stop page add account owner", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/stop-page-add-account-owner";
        request.headers.referer = "/authorised-agent/cannot";
        getExtraDataSpy.mockReturnValueOnce(undefined);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });
    it("should not allow a standard user to access the add user page", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/add-user";
        request.headers.referer = "/authorised-agent/any-referer";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(standardUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/view-users");
    });
    it("should not allow a standard user to access the remove member page", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/remove-member/123";
        request.headers.referer = "/authorised-agent/any-referer";
        getExtraDataSpy.mockReturnValueOnce(undefined)
            .mockReturnValue(standardUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });
    it("should throw an error when the user has removed themselves", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/remove-member/123";
        request.headers.referer = "/authorised-agent/any-referer";
        getExtraDataSpy.mockReturnValueOnce(true);

        expect(() => navigationMiddleware(request, response, mockedNext))
            .toThrow(InvalidAcspNumberError);

        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).not.toHaveBeenCalled();
    });

    it("should allow the user to access the confirmation you are removed page when they removed themselves", () => {
        // Given
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        request.originalUrl = "/authorised-agent/confirmation-you-are-removed";
        request.headers.referer = "/authorised-agent/remove-member/123";
        getExtraDataSpy.mockReturnValueOnce(true)
            .mockReturnValue(adminUser);
        // When
        navigationMiddleware(request, response, mockedNext);
        // Then
        expect(mockedNext).toHaveBeenCalled();
        expect(response.redirect).not.toHaveBeenCalled();
    });
});
