import { NextFunction, Request, Response } from "express";
import { loggedUserAcspMembershipMiddleware } from "../../src/middleware/loggedUserAcspMembership.middleware";

jest.mock("../../src/middleware/loggedUserAcspMembership.middleware");

// get handle on mocked function
const mockLoggedUserAcspMembershipMiddleware = loggedUserAcspMembershipMiddleware as jest.Mock;

// tell the mock what to return
mockLoggedUserAcspMembershipMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockLoggedUserAcspMembershipMiddleware;
