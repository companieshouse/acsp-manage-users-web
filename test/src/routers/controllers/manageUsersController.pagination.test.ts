import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import {
    accountOwnerAcspMembership,
    ComedyAlanAcspMembership,
    ComedyCharlieAcspMembership,
    ComedyDaraAcspMembership,
    ComedyDavidAcspMembership,
    ComedyFrankieAcspMembership,
    ComedyJimmyAcspMembership,
    ComedyKatherineAcspMembership,
    ComedyMichealAcspMembership,
    ComedyMickyAcspMembership,
    ComedyRussellAcspMembership,
    ComedyShaunAcspMembership,
    ComedyStephenAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership
} from "../../../mocks/acsp.members.mock";
import { when } from "jest-when";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as en from "../../../../src/locales/en/translation/manage-users.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";

const router = supertest(app);
const baseUrl = "/authorised-agent/manage-users";
const getAcspMembershipsSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getAcspMemberships");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const getMembershipForLoggedInUserSpy = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");

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

    it.each([
        // Given
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=1`, 6, 3, 0, 0, 4, 4, 4],
        [`${baseUrl}?ownerPage=4&adminPage=1&standardPage=1`, 4, 2, 2, 1, 4, 4, 4],
        [`${baseUrl}?ownerPage=4&adminPage=4&standardPage=1`, 2, 1, 4, 2, 4, 4, 4],
        [`${baseUrl}?ownerPage=4&adminPage=1&standardPage=4`, 2, 1, 4, 2, 4, 4, 4]
    ])("should return the expected page content for url %s", async (
        url,
        nextCount,
        nextPageCount,
        previousCount,
        previousPageCount,
        ownerTotalPages,
        adminTotalPages,
        standardTotalPages
    ) => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        const accountOwnerAcspMemberships = getMockAcspMembersResource([
            ComedyJimmyAcspMembership,
            ComedyShaunAcspMembership,
            ComedyStephenAcspMembership,
            ComedyAlanAcspMembership
        ], 4, 1, 4 * ownerTotalPages, ownerTotalPages);
        const administratorAcspMemberships = getMockAcspMembersResource([
            ComedyDavidAcspMembership,
            ComedyCharlieAcspMembership,
            ComedyKatherineAcspMembership,
            ComedyDaraAcspMembership
        ], 4, 1, 4 * adminTotalPages, adminTotalPages);
        const standardUserAcspMemberships = getMockAcspMembersResource([
            ComedyRussellAcspMembership,
            ComedyFrankieAcspMembership,
            ComedyMickyAcspMembership,
            ComedyMichealAcspMembership
        ], 4, 1, 4 * standardTotalPages, standardTotalPages);
        when(getMembershipForLoggedInUserSpy)
            .calledWith(expect.anything())
            .mockResolvedValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));
        when(getAcspMembershipsSpy)
            .calledWith(expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), [UserRole.OWNER])
            .mockResolvedValue(accountOwnerAcspMemberships);
        when(getAcspMembershipsSpy)
            .calledWith(expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), [UserRole.ADMIN])
            .mockResolvedValue(administratorAcspMemberships);
        when(getAcspMembershipsSpy)
            .calledWith(expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), [UserRole.STANDARD])
            .mockResolvedValue(standardUserAcspMemberships);
        // When
        const response = await router.get(url);
        // Then
        expect((response.text.match(new RegExp(enCommon.next, "g")) || []).length).toEqual(nextCount);
        expect((response.text.match(new RegExp(enCommon.next_page, "g")) || []).length).toEqual(nextPageCount);
        expect((response.text.match(new RegExp(enCommon.previous, "g")) || []).length).toEqual(previousCount);
        expect((response.text.match(new RegExp(enCommon.previous_page, "g")) || []).length).toEqual(previousPageCount);
    });
});
