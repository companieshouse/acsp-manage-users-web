/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { acspManageUsersAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { acspAuthMiddleware } from "../../../src/middleware/acsp.authentication.middleware";
import * as constants from "../../../src/lib/constants";
import * as sessionUtils from "../../../src/lib/utils/sessionUtils";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = acspManageUsersAuthMiddleware as jest.Mock;
const mockAuthReturnedFunction = jest.fn();
const getLoggedInAcspNumberSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInAcspNumber");

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const URL = "/authorised-agent/something";
const req: Request = {
    originalUrl: ""
} as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chsurl.co",
    returnUrl: URL,
    acspNumber: "ABC123"
};

describe("authentication middleware tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call CH authentication library", () => {
        getLoggedInAcspNumberSpy.mockReturnValue("ABC123");
        acspAuthMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should not call acspManageUsersAuthMiddleware when url is on whitelist", () => {
        req.originalUrl = constants.LANDING_URL + constants.HEALTHCHECK;
        acspAuthMiddleware(req, res, next);
        expect(mockAuthMiddleware).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
