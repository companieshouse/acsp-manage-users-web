import mocks from "../../../mocks/all.middleware.mock";
import { standardUserMembership } from "../../../mocks/user.mock";
import {
    administratorAcspMembership,
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
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Membership } from "../../../../src/types/membership";

const router = supertest(app);

const url = "/authorised-agent/edit-member-role";
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

describe("GET /authorised-agent/edit-member-role", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(standardUserMembership);
        // When
        await router.get(`${url}/${standardUserMembership.id}`);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    test.each([
        [200, "English", UserRole.OWNER, loggedAccountOwnerAcspMembership, standardUserMembership, "en", en, enCommon],
        [200, "Welsh", UserRole.OWNER, loggedAccountOwnerAcspMembership, standardUserMembership, "cy", cy, cyCommon],
        [200, "English", UserRole.ADMIN, administratorAcspMembership, standardUserMembership, "en", en, enCommon],
        [200, "Welsh", UserRole.ADMIN, administratorAcspMembership, standardUserMembership, "cy", cy, cyCommon],
        [500, "English", UserRole.STANDARD, standardUserAcspMembership, standardUserMembership, "en", en, enCommon],
        [500, "Welsh", UserRole.STANDARD, standardUserAcspMembership, standardUserMembership, "cy", cy, cyCommon]
    ])("should return status %s and the expected content if the language is set to %s and the loggedin user role is %s",
        async (status, _langVersionInfo, loggedUserRole, loggedUserMembership, mockUserData, langVersion, lang, langCommon) => {
            // Given
            getLoggedUserAcspMembershipSpy.mockReturnValue(loggedUserMembership);
            getExtraDataSpy.mockReturnValue([mockUserData]);
            // When
            const response = await router.get(`${url}/${mockUserData.id}?lang=${langVersion}`);
            // Then
            const decodedResponseText = response.text.replace(/&#39;/g, "'");
            expect(response.status).toEqual(status);
            if (loggedUserRole === UserRole.STANDARD) {
                expect(decodedResponseText).not.toContain(loggedUserMembership.acspName);
            } else {
                expect(decodedResponseText).toContain(loggedUserMembership.acspName);
            }
            expect(containsContent(loggedUserRole, decodedResponseText, mockUserData, lang, langCommon)).toBeTruthy();
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
        containsExpectedContent = !responseText.includes(`${lang.change_role_for}${mockUserData.userEmail}`) &&
            !responseText.includes(`${lang.user_role_tags.administrator}`) &&
            !responseText.includes(`${lang.they_will_be_able_to_add_and_remove}`) &&
            !responseText.includes(`${lang.they_will_be_able_to_add_and_remove_bullet_points[0]}`) &&
            !responseText.includes(`${lang.they_will_be_able_to_add_and_remove_bullet_points[1]}`) &&
            !responseText.includes(`${lang.user_role_tags.standard_user}`) &&
            !responseText.includes(`${lang.they_will_not_be_able}`) &&
            !responseText.includes(`${lang.all_users_who_are_added}`) &&
            !responseText.includes(`${lang.all_users_who_are_added_bullet_points[0]}`) &&
            !responseText.includes(`${lang.all_users_who_are_added_bullet_points[1]}`) &&
            !responseText.includes(`${langCommon.continue}`);
    }

    if (containsExpectedContent && (userRole === UserRole.ADMIN || userRole === UserRole.STANDARD)) {
        containsExpectedContent = !responseText.includes(`${lang.user_role_tags.account_owner}`) &&
            !responseText.includes(`${lang.they_will_be_able_to}`) &&
            !responseText.includes(`${lang.they_will_be_able_to_bullet_points[0]}`) &&
            !responseText.includes(`${lang.they_will_be_able_to_bullet_points[1]}`);
    }

    if (containsExpectedContent && userRole === UserRole.OWNER) {
        containsExpectedContent = responseText.includes(`${lang.user_role_tags.account_owner}`) &&
            responseText.includes(`${lang.they_will_be_able_to}`) &&
            responseText.includes(`${lang.they_will_be_able_to_bullet_points[0]}`) &&
            responseText.includes(`${lang.they_will_be_able_to_bullet_points[1]}`);
    }

    if (containsExpectedContent && (userRole === UserRole.OWNER || userRole === UserRole.ADMIN)) {
        containsExpectedContent = responseText.includes(`${lang.user_role_tags.administrator}`) &&
            responseText.includes(`${lang.they_will_be_able_to_add_and_remove}`) &&
            responseText.includes(`${lang.they_will_be_able_to_add_and_remove_bullet_points[0]}`) &&
            responseText.includes(`${lang.they_will_be_able_to_add_and_remove_bullet_points[1]}`) &&
            responseText.includes(`${lang.user_role_tags.standard_user}`) &&
            responseText.includes(`${lang.they_will_not_be_able}`) &&
            responseText.includes(`${lang.all_users_who_are_added}`) &&
            responseText.includes(`${lang.all_users_who_are_added_bullet_points[0]}`) &&
            responseText.includes(`${lang.all_users_who_are_added_bullet_points[1]}`) &&
            responseText.includes(`${langCommon.continue}`);
    }

    return containsExpectedContent;
};
