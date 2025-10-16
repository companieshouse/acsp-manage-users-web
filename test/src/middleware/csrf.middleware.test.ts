jest.mock("@companieshouse/web-security-node");
jest.mock("ioredis");

import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { csrfProtectionMiddleware } from "../../../src/middleware/csrf.protection.middleware";
import * as constants from "../../../src/lib/constants";

const mockCsrfProtectionMiddleware = CsrfProtectionMiddleware as jest.Mock;
const mockCsrfReturnedFunction = jest.fn();

mockCsrfProtectionMiddleware.mockReturnValue(mockCsrfReturnedFunction);

const URL = "/authorised-agent/something";
const req: Request = { originalUrl: URL } as Request;
const res: Response = {} as Response;
const next = jest.fn();

describe("Csrf middleware tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call web security node csrfProtectionMiddleware middleware", () => {
        csrfProtectionMiddleware(req, res, next);
        expect(mockCsrfReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should not call returned csrf middleware function when url is in whitelist", () => {
        req.originalUrl = constants.HEALTHCHECK_FULL_URL;
        csrfProtectionMiddleware(req, res, next);
        expect(mockCsrfReturnedFunction).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
