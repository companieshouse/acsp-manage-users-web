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
import * as enCommon from "../../../../locales/en/common.json";

const router = supertest(app);
const baseUrl = "/authorised-agent/manage-users";
const getAcspMembershipsSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getAcspMemberships");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const getMembershipForLoggedInUserSpy = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");

type PaginetionTestParams = {
    nextCount: number;
    nextPageCount: number;
    previousCount: number;
    previousPageCount: number;
    ownerTotalPages: number;
    adminTotalPages: number;
    standardTotalPages: number;
}

const getPaginationTestParams = (
    nextCount: number,
    nextPageCount: number,
    previousCount: number,
    previousPageCount: number,
    ownerTotalPages: number,
    adminTotalPages: number,
    standardTotalPages: number
): PaginetionTestParams => {
    return {
        nextCount,
        nextPageCount,
        previousCount,
        previousPageCount,
        ownerTotalPages,
        adminTotalPages,
        standardTotalPages
    };
};

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
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=1`, "all three", getPaginationTestParams(6, 3, 0, 0, 4, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=4`, "all three", getPaginationTestParams(4, 2, 2, 1, 4, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=4&standardPage=4`, "all three", getPaginationTestParams(2, 1, 4, 2, 4, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=4&standardPage=1`, "all three", getPaginationTestParams(4, 2, 2, 1, 4, 4, 4)],
        [`${baseUrl}?ownerPage=4&adminPage=1&standardPage=1`, "all three", getPaginationTestParams(4, 2, 2, 1, 4, 4, 4)],
        [`${baseUrl}?ownerPage=4&adminPage=4&standardPage=1`, "all three", getPaginationTestParams(2, 1, 4, 2, 4, 4, 4)],
        [`${baseUrl}?ownerPage=4&adminPage=1&standardPage=4`, "all three", getPaginationTestParams(2, 1, 4, 2, 4, 4, 4)],
        [`${baseUrl}?ownerPage=4&adminPage=4&standardPage=4`, "all three", getPaginationTestParams(0, 0, 6, 3, 4, 4, 4)],
        [`${baseUrl}?ownerPage=0&adminPage=abc&standardPage=`, "all three", getPaginationTestParams(6, 3, 0, 0, 4, 4, 4)],
        [`${baseUrl}?ownerPage=220&adminPage=1&standardPage=1`, "all three", getPaginationTestParams(6, 3, 0, 0, 4, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=1343&standardPage=1`, "all three", getPaginationTestParams(6, 3, 0, 0, 4, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=341`, "all three", getPaginationTestParams(6, 3, 0, 0, 4, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=1`, "some", getPaginationTestParams(0, 0, 0, 0, 1, 1, 1)],
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=4`, "some", getPaginationTestParams(0, 0, 2, 1, 1, 1, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=4&standardPage=4`, "some", getPaginationTestParams(0, 0, 4, 2, 1, 4, 4)],
        [`${baseUrl}?ownerPage=1&adminPage=4&standardPage=1`, "some", getPaginationTestParams(0, 0, 2, 1, 1, 4, 1)],
        [`${baseUrl}?ownerPage=4&adminPage=1&standardPage=1`, "some", getPaginationTestParams(0, 0, 2, 1, 4, 1, 1)],
        [`${baseUrl}?ownerPage=4&adminPage=4&standardPage=1`, "some", getPaginationTestParams(0, 0, 4, 2, 4, 4, 1)],
        [`${baseUrl}?ownerPage=1&adminPage=1&standardPage=4`, "some", getPaginationTestParams(2, 1, 2, 1, 4, 1, 4)]
    ])("should return the expected page content for url %s and %s paginations present", async (
        url,
        _paginationPresent,
        paginationTestParams
    ) => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        const accountOwnerAcspMemberships = getMockAcspMembersResource([
            ComedyJimmyAcspMembership,
            ComedyShaunAcspMembership,
            ComedyStephenAcspMembership,
            ComedyAlanAcspMembership
        ], 4, 1, 4 * paginationTestParams.ownerTotalPages, paginationTestParams.ownerTotalPages);
        const administratorAcspMemberships = getMockAcspMembersResource([
            ComedyDavidAcspMembership,
            ComedyCharlieAcspMembership,
            ComedyKatherineAcspMembership,
            ComedyDaraAcspMembership
        ], 4, 1, 4 * paginationTestParams.adminTotalPages, paginationTestParams.adminTotalPages);
        const standardUserAcspMemberships = getMockAcspMembersResource([
            ComedyRussellAcspMembership,
            ComedyFrankieAcspMembership,
            ComedyMickyAcspMembership,
            ComedyMichealAcspMembership
        ], 4, 1, 4 * paginationTestParams.standardTotalPages, paginationTestParams.standardTotalPages);
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
        expect((response.text.match(new RegExp(enCommon.next, "g")) || []).length).toEqual(paginationTestParams.nextCount);
        expect((response.text.match(new RegExp(enCommon.next_page, "g")) || []).length).toEqual(paginationTestParams.nextPageCount);
        expect((response.text.match(new RegExp(enCommon.previous, "g")) || []).length).toEqual(paginationTestParams.previousCount);
        expect((response.text.match(new RegExp(enCommon.previous_page, "g")) || []).length).toEqual(paginationTestParams.previousPageCount);
    });
});
