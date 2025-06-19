import { signOutErrorHandler } from "../../../../src/routers/controllers/errorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";
import { SignOutError } from "../../../../src/lib/utils/errors/sign-out-error";
import * as constants from "../../../../src/lib/constants";

jest.mock("../../../../src/lib/Logger");

logger.error = jest.fn();
const request = mockRequest();
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("signOutErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        response.set = jest.fn();
    });

    it("should detect a SignOutError and redirect to signout", async () => {
        // Given

        const err = new SignOutError("Test sign out error");
        // When
        signOutErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.set).toHaveBeenCalledWith("Referrer-Policy", "origin");
        expect(response.redirect).toHaveBeenCalledWith(constants.SIGN_OUT_URL);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it("should ignore errors that are not of type SignOutError and pass then to next", async () => {
        const error = new Error();
        // When
        signOutErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.redirect).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});
