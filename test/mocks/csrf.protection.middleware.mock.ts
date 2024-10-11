import { NextFunction, Request, Response } from "express";
import { csrfProtectionMiddleware } from "../../src/middleware/session.middleware";

jest.mock("../../src/middleware/session.middleware");

const mockCsrfProtectionMiddleware = csrfProtectionMiddleware as jest.Mock;

mockCsrfProtectionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockCsrfProtectionMiddleware;
