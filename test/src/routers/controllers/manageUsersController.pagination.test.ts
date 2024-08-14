import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import { accountOwnerAcspMembership, ComedyAlanAcspMembership, ComedyCharlieAcspMembership, ComedyDaraAcspMembership, ComedyDavidAcspMembership, ComedyFrankieAcspMembership, ComedyHenningAcspMembership, ComedyJackAcspMembership, ComedyJimmyAcspMembership, ComedyJoAcspMembership, ComedyJonAcspMembership, ComedyKatherineAcspMembership, ComedyMichealAcspMembership, ComedyMickyAcspMembership, ComedyRussellAcspMembership, ComedyShaunAcspMembership, ComedyStephenAcspMembership, getMockAcspMembersResource, loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";

const router = supertest(app);
const baseUrl = "/authorised-agent/manage-users";
const getAcspMembershipsSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getAcspMemberships");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

getAcspMembershipsSpy
    .mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership]));

describe("GET /authorised-agent/manage-users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        await router.get(baseUrl);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    it("should return the expected page", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        getAcspMembershipsSpy.mockResolvedValue(getMockAcspMembersResource([
            ComedyJimmyAcspMembership,
            ComedyShaunAcspMembership,
            ComedyDavidAcspMembership,
            ComedyCharlieAcspMembership,
            ComedyKatherineAcspMembership,
            ComedyRussellAcspMembership,
            ComedyFrankieAcspMembership,
            ComedyMickyAcspMembership,
            ComedyStephenAcspMembership,
            ComedyAlanAcspMembership,
            ComedyDaraAcspMembership,
            ComedyJackAcspMembership,
            ComedyJonAcspMembership,
            ComedyMichealAcspMembership,
            ComedyJoAcspMembership,
            ComedyHenningAcspMembership
        ]));
        // When
        const response = await router.get(baseUrl);
        // Then
        expect(response.text).toContain("ownerPage");
    });
});
