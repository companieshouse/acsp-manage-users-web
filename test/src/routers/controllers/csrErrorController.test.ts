import { csrfErrorHandler } from "../../../../src/routers/controllers/errorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import { CsrfError } from "@companieshouse/web-security-node";
import * as contants from "../../../../src/lib/constants";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

logger.error = jest.fn();
const request = mockRequest();
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("csrfErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect a csrfError and render an error template", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        mockGetTranslationsForView.mockReturnValue({});

        const err = new CsrfError();
        // When
        csrfErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.redirect).toHaveBeenCalledWith(contants.SOMETHING_WENT_WRONG_FULL_URL);
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining(`CSRF Error occured`)
        );
    });

    it("should ignore errors that are not of type CsrfError and pass then to next", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";

        const error = new Error();
        // When
        csrfErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.render).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});
