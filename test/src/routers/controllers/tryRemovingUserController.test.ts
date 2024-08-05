import mocks from "../../../mocks/all.middleware.mock";
import { userAdamBrownRemoveDetails, userJohnSmithRemoveDetails } from "../../../mocks/user.mock";
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

const url = "/authorised-agent/try-removing-user";

describe("GET /authorised-agent/try-removing-user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userAdamBrownRemoveDetails);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 302 and redirect to /authorised-agent/confirmation-member-removed", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userAdamBrownRemoveDetails);
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/confirmation-member-removed";
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });

    it("should return status 302 and redirect to /authorised-agent/confirmation-you-are-removed when removing themselves", async () => {
        // Given
        const userToRemove = {
            ...userAdamBrownRemoveDetails,
            removingThemselves: true
        };
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userToRemove);
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/confirmation-you-are-removed";
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });

    it("should return status 302 and redirect to /authorised-agent/member-already-removed", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userJohnSmithRemoveDetails);
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/member-already-removed";
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });
});
