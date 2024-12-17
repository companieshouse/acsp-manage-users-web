import { NextFunction, Request, Response } from "express";
import { acspAuthMiddleware } from "../../src/middleware/acsp.authentication.middleware";

jest.mock("../../src/middleware/acsp.authentication.middleware");

const mockAcspAuthMiddleware = acspAuthMiddleware as jest.Mock;

mockAcspAuthMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockAcspAuthMiddleware;
