import { invalidAcspNumberErrorHandler } from "../../../../src/routers/controllers/errorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import { InvalidAcspNumberError } from "@companieshouse/web-security-node";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");
const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");
const getLoggedInUserIdSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserId");

logger.error = jest.fn();
const request = mockRequest();
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("invalidAcspNumberErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect an InvalidAcspNumberError and redirect to the access denied page", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        mockGetTranslationsForView.mockReturnValueOnce({});
        const loggedInEmail = "test@test.com";
        getLoggedInUserEmailSpy.mockReturnValue(loggedInEmail);
        const userId = "abc1234567890";
        getLoggedInUserIdSpy.mockReturnValue(userId);
        const err = new InvalidAcspNumberError();
        // When
        invalidAcspNumberErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.redirect).toHaveBeenCalledWith(constants.ACCESS_DENIED_FULL_URL);
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining(`Access denied - the user with ID ${userId} does not have a valid ACSP number in session.`)
        );
    });

    it("should ignore errors that are not of type InvalidAcspNumberError and pass then to next", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        const error = new Error();
        // When
        invalidAcspNumberErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.render).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});
