import mocks from "../../../mocks/all.middleware.mock";
import { loggedOwnerUserMembership, standardUserMembership } from "../../../mocks/user.mock";
import {
    administratorAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/edit-member-role.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/edit-member-role.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Membership } from "../../../../src/types/membership";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import { when } from "jest-when";
import * as helpers from "../../../../src/lib/helpers/fetchAndValidateMembership";

jest.mock("../../../../src/lib/helpers/fetchAndValidateMembership");
jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const url = "/authorised-agent/edit-member-role";
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const getAcspMembershipsSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getAcspMemberships");

describe("GET /authorised-agent/edit-member-role", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue([standardUserMembership]);
        // When
        await router.get(`${url}/${standardUserMembership.id}`);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    test.each([
        [200, "en", UserRole.OWNER, loggedAccountOwnerAcspMembership, standardUserMembership, en, enCommon],
        [200, "cy", UserRole.OWNER, loggedAccountOwnerAcspMembership, standardUserMembership, cy, cyCommon],
        [200, "en", UserRole.ADMIN, administratorAcspMembership, standardUserMembership, en, enCommon],
        [200, "cy", UserRole.ADMIN, administratorAcspMembership, standardUserMembership, cy, cyCommon],
        [500, "en", UserRole.STANDARD, standardUserAcspMembership, standardUserMembership, en, enCommon],
        [500, "cy", UserRole.STANDARD, standardUserAcspMembership, standardUserMembership, cy, cyCommon],
        [302, "en", UserRole.OWNER, loggedAccountOwnerAcspMembership, loggedOwnerUserMembership, en, enCommon],
        [302, "cy", UserRole.OWNER, loggedAccountOwnerAcspMembership, loggedOwnerUserMembership, cy, cyCommon]
    ])("should return status %s and the expected content if the language is set to '%s' and the loggedin user role is %s",
        async (status, langVersion, loggedUserRole, loggedUserMembership, mockUserData, lang, langCommon) => {
            // Given
            getLoggedUserAcspMembershipSpy.mockReturnValue(loggedUserMembership);
            when(getExtraDataSpy).calledWith(expect.anything(), constants.MANAGE_USERS_MEMBERSHIP).mockReturnValue([mockUserData]);
            when(getExtraDataSpy).calledWith(expect.anything(), constants.USER_ROLE_CHANGE_DATA).mockReturnValue(undefined);
            getAcspMembershipsSpy.mockResolvedValue(getMockAcspMembersResource([loggedUserMembership]));
            // When
            const response = await router.get(`${url}/${mockUserData.id}?lang=${langVersion}`);
            // Then
            const decodedResponseText = response.text.replace(/&#39;/g, "'");
            expect(response.status).toEqual(status);
            if (response.status === 302 && loggedUserMembership.userRole === UserRole.OWNER && loggedUserMembership.userId === mockUserData.userId) {
                expect(response.text).toContain("Found. Redirecting to /authorised-agent/stop-page-add-account-owner");
            } else {
                if (loggedUserRole === UserRole.STANDARD) {
                    expect(decodedResponseText).not.toContain(loggedUserMembership.acspName);
                } else {
                    expect(decodedResponseText).toContain(loggedUserMembership.acspName);
                }
                expect(containsContent(loggedUserRole, decodedResponseText, mockUserData, lang, langCommon)).toBeTruthy();
            }
        });

    it("should fetch member details and render fetched data when user not found in session", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        when(getExtraDataSpy).calledWith(expect.anything(), constants.MANAGE_USERS_MEMBERSHIP).mockReturnValue([loggedOwnerUserMembership]);
        when(getExtraDataSpy).calledWith(expect.anything(), constants.USER_ROLE_CHANGE_DATA).mockReturnValue(undefined);
        getAcspMembershipsSpy.mockResolvedValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));
        (helpers.fetchAndValidateMembership as jest.Mock).mockResolvedValue(standardUserMembership);
        // When
        const id = "idNotInSession";
        const response = await router.get(`${url}/${id}?lang=en`);
        // Then
        const decodedResponseText = response.text.replace(/&#39;/g, "'");
        expect(response.status).toEqual(200);
        expect(decodedResponseText).toContain(standardUserMembership.userDisplayName);
    });

    it("should return an error page when user not in session and the fetch failed", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        when(getExtraDataSpy).calledWith(expect.anything(), constants.MANAGE_USERS_MEMBERSHIP).mockReturnValue([loggedOwnerUserMembership]);
        when(getExtraDataSpy).calledWith(expect.anything(), constants.USER_ROLE_CHANGE_DATA).mockReturnValue(undefined);
        getAcspMembershipsSpy.mockResolvedValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));
        (helpers.fetchAndValidateMembership as jest.Mock).mockResolvedValue(undefined);
        // When
        const id = "idNotInSession";
        const response = await router.get(`${url}/${id}?lang=en`);
        // Then
        expect(response.status).toBe(500);
    });
});

describe("POST /authorised-agent/edit-member-role", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue([standardUserMembership]);
        // When
        await router.post(`${url}/${standardUserMembership.id}`);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    it("should return error message if no new role selected", async () => {
        // Given
        when(getExtraDataSpy).calledWith(expect.anything(), constants.MANAGE_USERS_MEMBERSHIP).mockReturnValue([standardUserMembership]);
        when(getExtraDataSpy).calledWith(expect.anything(), constants.USER_ROLE_CHANGE_DATA).mockReturnValue(undefined);
        // When
        const response = await router.post(`${url}/${standardUserMembership.id}?lang=en`).send({ userRole: standardUserMembership.userRole });
        // Then
        expect(response.text).toContain(en.errors_select_user_role_to_change_for_the_user);
    });

    it("should redirect to the next page if a new role selected", async () => {
        // Given
        getExtraDataSpy.mockReturnValue([standardUserMembership]);
        // When
        const response = await router.post(`${url}/${standardUserMembership.id}`).send({ userRole: UserRole.ADMIN });
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL);
    });
});

const containsContent = (
    userRole: UserRole,
    responseText: string,
    mockUserData: Membership,
    lang: any,
    langCommon: { [key: string]: string }
): boolean => {
    let containsExpectedContent = true;

    if (userRole === UserRole.STANDARD) {
        containsExpectedContent = !responseText.includes(`${lang.select_the_new_role_for}${mockUserData.userEmail}`) &&
            !responseText.includes(`${lang.select_the_new_role_for}${mockUserData.userDisplayName}`) &&
            !responseText.includes(`${lang.user_role_tags.administrator}`) &&
            !responseText.includes(`${lang.theyll_be_able_to_view_all_users}`) &&
            !responseText.includes(`<li>${lang.theyll_be_able_to_view_all_users_bullet_points[0]}`) &&
            !responseText.includes(`<li>${lang.theyll_be_able_to_view_all_users_bullet_points[1]}`) &&
            !responseText.includes(`${lang.user_role_tags.standard_user}`) &&
            !responseText.includes(`${lang.they_will_not_be_able_to}`) &&
            !responseText.includes(`${langCommon.continue}`);
    }

    if (containsExpectedContent && (userRole === UserRole.ADMIN || userRole === UserRole.STANDARD)) {
        containsExpectedContent = !responseText.includes(`${lang.user_role_tags.account_owner}`) &&
            !responseText.includes(`${lang.theyll_be_able_to}`) &&
            !responseText.includes(`<li>${lang.theyll_be_able_to_bullet_points[0]}`) &&
            !responseText.includes(`<li>${lang.theyll_be_able_to_bullet_points[1]}`) &&
            !responseText.includes(`<li>${lang.theyll_be_able_to_bullet_points[2]}`);
    }

    if (containsExpectedContent && userRole === UserRole.OWNER) {
        containsExpectedContent = responseText.includes(`${lang.user_role_tags.account_owner}`) &&
            responseText.includes(`${lang.theyll_be_able_to}`) &&
            responseText.includes(`<li>${lang.theyll_be_able_to_bullet_points[0]}`) &&
            responseText.includes(`<li>${lang.theyll_be_able_to_bullet_points[1]}`) &&
            responseText.includes(`<li>${lang.theyll_be_able_to_bullet_points[2]}`);
    }

    if (containsExpectedContent && (userRole === UserRole.OWNER || userRole === UserRole.ADMIN)) {
        containsExpectedContent = (responseText.includes(`${lang.select_the_new_role_for}${mockUserData.userEmail}`) ||
            responseText.includes(`${lang.select_the_new_role_for}${mockUserData.userDisplayName}`)) &&
            responseText.includes(`${lang.user_role_tags.administrator}`) &&
            responseText.includes(`${lang.theyll_be_able_to_view_all_users}`) &&
            responseText.includes(`<li>${lang.theyll_be_able_to_view_all_users_bullet_points[0]}`) &&
            responseText.includes(`<li>${lang.theyll_be_able_to_view_all_users_bullet_points[1]}`) &&
            responseText.includes(`${lang.user_role_tags.standard_user}`) &&
            responseText.includes(`${lang.they_will_not_be_able_to}`) &&
            responseText.includes(`${lang.all_users_who_are_added}`) &&
            responseText.includes(`<li>${lang.all_users_who_are_added_bullet_points[0]}`) &&
            responseText.includes(`<li>${lang.all_users_who_are_added_bullet_points[1]}`) &&
            responseText.includes(`${langCommon.cancel}`) &&
            responseText.includes(`${langCommon.continue}`);
    }

    return containsExpectedContent;
};
