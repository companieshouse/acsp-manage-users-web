import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/stop-page-add-account-owner.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/stop-page-add-account-owner.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";
import { MemberForRemoval } from "../../../../src/types/membership";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { adminUserRoleChangeDataMock } from "../../../mocks/user.mock";
import { session } from "../../../mocks/session.middleware.mock";

const router = supertest(app);

const url = "/authorised-agent/stop-page-add-account-owner";
const companyName = "MORRIS ACCOUNTING LTD";

const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const loggedInUserMembership = {
    id: "123;",
    userId: "123",
    userRole: "admin",
    acspNumber: "123",
    acspName: companyName
};

const userDetails: MemberForRemoval = {
    userEmail: "james.morris@gmail.com",
    userDisplayName: "James Morris",
    displayNameOrEmail: "James Morris",
    id: "123",
    userId: "123",
    userRole: UserRole.ADMIN,
    acspNumber: "123"
};

describe("GET /authorised-agent/stop-page-add-account-owner", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        session.deleteExtraData(constants.DETAILS_OF_USER_TO_REMOVE);
        session.deleteExtraData(constants.USER_ROLE_CHANGE_DATA);
    });

    it("should check session and user auth before returning the page", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        ["English", "is removed", "en", en, enCommon, constants.DETAILS_OF_USER_TO_REMOVE, userDetails],
        ["Welsh", "is removed", "cy", cy, cyCommon, constants.DETAILS_OF_USER_TO_REMOVE, userDetails],
        ["English", "role is changed", "en", en, enCommon, constants.USER_ROLE_CHANGE_DATA, adminUserRoleChangeDataMock],
        ["Welsh", "role is changed", "cy", cy, cyCommon, constants.USER_ROLE_CHANGE_DATA, adminUserRoleChangeDataMock]
    ])("should return expected %s content if admin user %s and languade set to %s",
        async (_langInfo, _taskInfo, langVersion, lang, langCommon, key, data) => {
            // Given
            session.setExtraData(key, data);
            getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
            // When
            const encodedResponse = await router.get(`${url}?lang=${langVersion}`);
            const responseText = encodedResponse.text.replace(/&#39;/g, "'");
            // Then
            expect(encodedResponse.status).toEqual(200);
            if (_taskInfo === "is removed") {
                expect(responseText).toContain(lang.page_header_removal);
                expect(responseText).toContain(lang.you_cannot_remove_yourself);
                expect(responseText).not.toContain(lang.page_header_change_role);
                expect(responseText).not.toContain(lang.you_cannot_change_your_role);
                expect(responseText).not.toContain(lang.you_need_to_add);
                expect(responseText).not.toContain(lang.before_you_change_your_role);
            } else {
                expect(responseText).toContain(lang.page_header_change_role);
                expect(responseText).toContain(lang.you_cannot_change_your_role);
                expect(responseText).toContain(lang.you_need_to_add);
                expect(responseText).toContain(lang.before_you_change_your_role);
                expect(responseText).not.toContain(lang.page_header_removal);
                expect(responseText).not.toContain(lang.you_cannot_remove_yourself);
            }
            expect(responseText).toContain(lang.details.why_the_authorised_agent_must);
            expect(responseText).toContain(lang.details.this_is_because);
            expect(responseText).toContain(lang.details.update_the_accout_details);
            expect(responseText).toContain(lang.details.theyll_need_to_do_this);
            expect(responseText).toContain(lang.details.the_authorised_agent);
            expect(responseText).toContain(lang.details.account_owners_are);
            expect(responseText).toContain(lang.details.account_owners_are_bullet_points[0]);
            expect(responseText).toContain(lang.details.account_owners_are_bullet_points[1]);
            expect(responseText).toContain(langCommon.go_to_manage_users);
        });

    it("should error when no person for removal or role change is in session", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        const response = await router.get(url);
        expect(response.status).toEqual(500);
        // Then
        expect(response.text).toContain("there is a problem with the service");
    });
});
