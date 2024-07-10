import mocks from "../../../mocks/all.middleware.mock";
import { userAdamBrownDetails, userJohnSmithDetails } from "../../../mocks/user.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../src/lib/constants";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const router = supertest(app);

const url = "/authorised-agent/try-adding-user";

describe("GET /authorised-agent/try-adding-user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, userAdamBrownDetails);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 302 and redirect to /authorised-agent/confirmation-member-added", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, userAdamBrownDetails);
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/confirmation-member-added";
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });

    it("should return status 302 and redirect to /authorised-agent/member-already-added", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, userJohnSmithDetails);
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/member-already-added";
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });
});
