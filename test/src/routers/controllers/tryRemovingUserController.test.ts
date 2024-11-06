import mocks from "../../../mocks/all.middleware.mock";
import { userAdamBrownRemoveDetails } from "../../../mocks/user.mock";
import { getMockAcspMembersResource, accountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../src/lib/constants";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const loggedInUserMembership = {
    id: "123;",
    userId: "123",
    userRole: "admin",
    acspNumber: "123",
    acspName: "companyName"
};
const router = supertest(app);
const mockUpdateOrRemoveUserAcspMembership = jest.spyOn(acspMemberService, "updateOrRemoveUserAcspMembership");
const mockGetAcspMemberships = jest.spyOn(acspMemberService, "getAcspMemberships");

const url = "/authorised-agent/try-removing-user";

describe("POST /authorised-agent/try-removing-user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userAdamBrownRemoveDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockUpdateOrRemoveUserAcspMembership.mockResolvedValue();
        // When
        await router.post(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    it("should return status 302 and redirect to /authorised-agent/confirmation-member-removed", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userAdamBrownRemoveDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockUpdateOrRemoveUserAcspMembership.mockResolvedValue();
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/confirmation-member-removed";
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });

    it("should return status 302 and redirect user to confirm you are removed page", async () => {
        // Given
        const userToRemove = {
            ...userAdamBrownRemoveDetails,
            removingThemselves: true
        };
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userToRemove);
        getLoggedUserAcspMembershipSpy.mockReturnValue({ ...userAdamBrownRemoveDetails });
        mockUpdateOrRemoveUserAcspMembership.mockResolvedValue();
        mockGetAcspMemberships.mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership]));
        const expectedPageHeading = "Found. Redirecting to";
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });
    it("should redirect to stop page when removing themselves and they are the only owner", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, accountOwnerAcspMembership);
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        mockUpdateOrRemoveUserAcspMembership.mockResolvedValue();
        mockGetAcspMemberships.mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership]));
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/stop-page-add-account-owner";
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });
});
