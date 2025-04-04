import { httpErrorHandler } from "../../../../src/routers/controllers/errorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";

jest.mock("../../../../src/lib/Logger");

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

logger.errorRequest = jest.fn();
const request = mockRequest();
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("httpErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect a http-error Error, call logger.errorRequest and redirect to something-went-wrong page when status code provided", async () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.UNAUTHORIZED;
        request.originalUrl = "/originalUrl";
        request.method = "POST";
        mockGetTranslationsForView.mockReturnValueOnce({});

        const unauthorizedError = createError(HTTP_STATUS_CODE, `An error messsage`);
        // When
        httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/something-went-wrong");
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError`)
        );
    });

    it("should detect a http-error Error, call logger.errorRequest and redirect to something-went-wrong page when status code not provided", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "POST";
        mockGetTranslationsForView.mockReturnValueOnce({});

        const internalServerError = createError(`An error messsage`);
        // When
        httpErrorHandler(internalServerError, request, response, mockNext);
        // Then
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/something-went-wrong");
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 500 InternalServerError`)
        );
    });

    it("should ignore errors that are not from http-errors modules, and pass then to next", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "POST";
        const error = new Error();
        // When
        httpErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.render).not.toHaveBeenCalled();
        expect(logger.errorRequest).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});
