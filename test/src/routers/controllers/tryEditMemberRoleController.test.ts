import mocks from "../../../mocks/all.middleware.mock";
import { ownerUserRoleChangeDataMock } from "../../../mocks/user.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import * as constants from "../../../../src/lib/constants";

const router = supertest(app);

const url = "/authorised-agent/try-edit-member-role";
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const updateOrRemoveUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "updateOrRemoveUserAcspMembership");

describe("POST /authorised-agent/try-edit-member-role", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(ownerUserRoleChangeDataMock);
        // When
        await router.post(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    it("should redirect to confirmation page if user role changed", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(ownerUserRoleChangeDataMock);
        updateOrRemoveUserAcspMembershipSpy.mockResolvedValue(undefined);
        const expectedPageHeading = "Found. Redirecting to /authorised-agent/confirmation-member-role-edited";
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL);
        expect(response.text).toContain(expectedPageHeading);
    });

    it("should render error page if user role change not successful", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(ownerUserRoleChangeDataMock);
        updateOrRemoveUserAcspMembershipSpy.mockRejectedValue(new Error());
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(400);
    });
});
