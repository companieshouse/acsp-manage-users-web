import mocks from "../../../mocks/all.middleware.mock";
import { adminUserRoleChangeDataMock, ownerUserRoleChangeDataMock, standardUserRoleChangeDataMock } from "../../../mocks/user.mock";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/check-edit-member-role-details.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/check-edit-member-role-details.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getUserRoleTag } from "../../../../src/lib/utils/viewUtils";

const router = supertest(app);

const url = "/authorised-agent/check-edit-member-role-details";
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

describe("GET /authorised-agent/check-edit-member-role-details", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(ownerUserRoleChangeDataMock);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    test.each([
        ["English", UserRole.OWNER, ownerUserRoleChangeDataMock, "en", en, enCommon],
        ["Welsh", UserRole.OWNER, ownerUserRoleChangeDataMock, "cy", cy, cyCommon],
        ["English", UserRole.ADMIN, adminUserRoleChangeDataMock, "en", en, enCommon],
        ["Welsh", UserRole.ADMIN, adminUserRoleChangeDataMock, "cy", cy, cyCommon],
        ["English", UserRole.STANDARD, standardUserRoleChangeDataMock, "en", en, enCommon],
        ["Welsh", UserRole.STANDARD, standardUserRoleChangeDataMock, "cy", cy, cyCommon]
    ])("should return status 200 and the expected content if the language is set to %s and the desired user role is %s",
        async (_langVersionInfo, userRole, mockUserRoleChangeData, langVersion, lang, langCommon) => {
            // Given
            getExtraDataSpy.mockReturnValue(mockUserRoleChangeData);
            const expectedUserRoleTag = getUserRoleTag(userRole, langVersion, false);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(loggedAccountOwnerAcspMembership.acspName);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(langCommon.email_address);
            expect(response.text).toContain(mockUserRoleChangeData.userEmail);
            expect(response.text).toContain(langCommon.role);
            expect(response.text).toContain(expectedUserRoleTag);
            expect(response.text).toContain(lang.change);
            expect(response.text).toContain(mockUserRoleChangeData.changeRolePageUrl);
            expect((response.text.match(new RegExp(mockUserRoleChangeData.changeRolePageUrl, "g")) || [])).toHaveLength(2);
            expect(response.text).toContain(lang.confirm_users_role);
        });
});
