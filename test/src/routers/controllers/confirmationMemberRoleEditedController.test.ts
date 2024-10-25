import mocks from "../../../mocks/all.middleware.mock";
import {
    adminUserRoleChangeDataMock,
    adminUserRoleChangeDataWithDisplayNameMock,
    ownerUserRoleChangeDataMock,
    ownerUserRoleChangeDataWithDisplayNameMock,
    standardUserRoleChangeDataMock,
    standardUserRoleChangeDataWithDisplayNameMock
} from "../../../mocks/user.mock";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as en from "../../../../locales/en/confirmation-member-role-edited.json";
import * as cy from "../../../../locales/cy/confirmation-member-role-edited.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";

const router = supertest(app);

const url = "/authorised-agent/confirmation-member-role-edited";
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

describe("GET /authorised-agent/confirmation-member-role-edited", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(ownerUserRoleChangeDataMock);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    test.each([
        ["English", UserRole.OWNER, "en", "provided", en, enCommon, ownerUserRoleChangeDataWithDisplayNameMock],
        ["English", UserRole.OWNER, "en", "not provided", en, enCommon, ownerUserRoleChangeDataMock],
        ["Welsh", UserRole.OWNER, "cy", "provided", cy, cyCommon, ownerUserRoleChangeDataWithDisplayNameMock],
        ["Welsh", UserRole.OWNER, "cy", "not provided", cy, cyCommon, ownerUserRoleChangeDataMock],
        ["English", UserRole.ADMIN, "en", "provided", en, enCommon, adminUserRoleChangeDataWithDisplayNameMock],
        ["English", UserRole.ADMIN, "en", "not provided", en, enCommon, adminUserRoleChangeDataMock],
        ["Welsh", UserRole.ADMIN, "cy", "provided", cy, cyCommon, adminUserRoleChangeDataWithDisplayNameMock],
        ["Welsh", UserRole.ADMIN, "cy", "not provided", cy, cyCommon, adminUserRoleChangeDataMock],
        ["English", UserRole.STANDARD, "en", "provided", en, enCommon, standardUserRoleChangeDataWithDisplayNameMock],
        ["English", UserRole.STANDARD, "en", "not provided", en, enCommon, standardUserRoleChangeDataMock],
        ["Welsh", UserRole.STANDARD, "cy", "provided", cy, cyCommon, standardUserRoleChangeDataWithDisplayNameMock],
        ["Welsh", UserRole.STANDARD, "cy", "not provided", cy, cyCommon, standardUserRoleChangeDataMock]
    ])("should return expected %s content if user role is %s and lang set to '%s' and user display name is %s",
        async (_expectedLanguage, userRole, langVersion, _userDisplayNameInfo, lang, langCommon, changeData) => {
            // Given
            getExtraDataSpy.mockReturnValue(changeData);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(`<span class="govuk-caption-l">${loggedAccountOwnerAcspMembership.acspName}</span>`);
            expect(response.text).toContain(lang.users_role_changed);
            expect(response.text).toContain(lang.well_sent_an_email_to);
            expect(response.text).toContain(`<span class="govuk-!-font-weight-bold">${changeData.userEmail}</span>${lang.to_tell_them_youve_chanaged_their_role}`);
            if (userRole === UserRole.OWNER) {
                if (changeData.userDisplayName) {
                    expect(response.text).toContain(`${changeData.userDisplayName}`);
                } else {
                    expect(response.text).toContain(`<span class="govuk-!-font-weight-bold">${changeData.userEmail}</span>`);
                }
                expect(response.text).toContain(`${lang.is_now_an_account_owner_for}${loggedAccountOwnerAcspMembership.acspName}`);
                expect(response.text).toContain(lang.what_an_account_owner_can_do);
                expect(response.text).toContain(lang.an_account_owner_can);
                expect(response.text).toContain(lang.they_can_also);
                expect(response.text).toContain(`<li>${lang.they_can_also_bullet_points[0]}</li>`);
                expect(response.text).toContain(`<li>${lang.they_can_also_bullet_points[1]}</li>`);
                expect(response.text).toContain(`<li>${lang.they_can_also_bullet_points[2]}</li>`);
                expect(response.text).toContain(`<li>${lang.they_can_also_bullet_points[3]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_add_and_remove_bullet_points[0]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_add_and_remove_bullet_points[1]}</li>`);
                expect(response.text).toContain(lang.if_any_of_the_details);
            } else if (userRole === UserRole.ADMIN) {
                if (changeData.userDisplayName) {
                    expect(response.text).toContain(`${changeData.userDisplayName}`);
                } else {
                    expect(response.text).toContain(`<span class="govuk-!-font-weight-bold">${changeData.userEmail}</span>`);
                }
                expect(response.text).toContain(`${lang.is_now_an_administrator_for}${loggedAccountOwnerAcspMembership.acspName}`);
                expect(response.text).toContain(lang.what_an_administrator_can_do);
                expect(response.text).toContain(lang.an_administrator_can);
                expect(response.text).toContain(lang.they_can_also_view_all_users + " " + lang.they_can_add_and_remove);
                expect(response.text).toContain(`<li>${lang.they_can_add_and_remove_bullet_points[0]}</li>`);
                expect(response.text).toContain(`<li>${lang.they_can_add_and_remove_bullet_points[1]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[0]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[1]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[2]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[3]}</li>`);
                expect(response.text).not.toContain(lang.if_any_of_the_details);
            } else {
                if (changeData.userDisplayName) {
                    expect(response.text).toContain(`${changeData.userDisplayName}`);
                } else {
                    expect(response.text).toContain(`<span class="govuk-!-font-weight-bold">${changeData.userEmail}</span>`);
                }
                expect(response.text).toContain(`${lang.is_now_a_standard_user_for}${loggedAccountOwnerAcspMembership.acspName}`);
                expect(response.text).toContain(lang.what_a_standard_user_can_do);
                expect(response.text).toContain(lang.a_standard_user_can);
                expect(response.text).toContain(lang.they_can_also_view_all_users + " " + lang.they_cannot_add_or_remove_users);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[0]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[1]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[2]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_also_bullet_points[3]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_add_and_remove_bullet_points[0]}</li>`);
                expect(response.text).not.toContain(`<li>${lang.they_can_add_and_remove_bullet_points[1]}</li>`);
                expect(response.text).not.toContain(lang.if_any_of_the_details);
            }
            expect(response.text).toContain(langCommon.go_to_manage_users);
        });
});
