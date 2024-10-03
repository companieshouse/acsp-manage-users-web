import { invalidAcspNumberErrorHandler } from "../../../../src/routers/controllers/errorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import { InvalidAcspNumberError } from "@companieshouse/web-security-node";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

logger.error = jest.fn();
const request = mockRequest();
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("invalidAcspNumberErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect a InvalidAcspNumberError and render an service unavailable template", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        mockGetTranslationsForView.mockReturnValueOnce({});

        const err = new InvalidAcspNumberError();
        // When
        invalidAcspNumberErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.render).toHaveBeenCalledWith("partials/service_unavailable", expect.anything());
        expect(logger.error).toHaveBeenCalledTimes(1);
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
