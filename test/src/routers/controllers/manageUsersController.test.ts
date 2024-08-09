import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/manage-users.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import {
    accountOwnerAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";

const router = supertest(app);

const url = "/authorised-agent/manage-users";
const mockGetAcspMemberships = jest.spyOn(acspMemberService, "getAcspMemberships");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

mockGetAcspMemberships
    .mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership]));

describe("GET /authorised-agent/manage-users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        const companyName = accountOwnerAcspMembership.acspName;
        const companyNumber = accountOwnerAcspMembership.acspName;
        const userEmailAddress = accountOwnerAcspMembership.userEmail;
        const userName = accountOwnerAcspMembership.userDisplayName;
        const expectedTitle = `${en.page_header}${enCommon.title_end}`;
        // When
        const result = await router.get(url);
        // Then
        expect(result.status).toEqual(200);
        expect(result.text).toContain(userEmailAddress);
        expect(result.text).toContain(userName);
        expect(result.text).toContain(companyName);
        expect(result.text).toContain(companyNumber);
        expect(result.text).toContain(en.page_header);
        expect(result.text).toContain(en.administrators);
        expect(result.text).toContain(en.back_link);
        expect(result.text).toContain(en.standard_users);
        expect(result.text).toContain(enCommon.email_address);
        expect(result.text).toContain(en.users_name);
        expect(result.text).toContain(en.remove_user);
        expect(result.text).toContain(en.remove);
        expect(result.text).toContain(en.add_a_user);
        expect(result.text).toContain(en.search);
        expect(result.text).toContain(en.cancel_search);
        expect(result.text).toContain(expectedTitle);
    });

    it("should return expected title and page header, and not contain add button if user role standard", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(standardUserAcspMembership);
        const expectedTitle = `${en.page_header_standard}${enCommon.title_end}`;
        // When
        const result = await router.get(url);
        // Then
        expect(result.status).toEqual(200);
        expect(result.text).toContain(en.page_header_standard);
        expect(result.text).toContain(en.administrators);
        expect(result.text).toContain(en.back_link);
        expect(result.text).toContain(en.standard_users);
        expect(result.text).toContain(enCommon.email_address);
        expect(result.text).toContain(en.users_name);
        expect(result.text).not.toContain(en.remove_user);
        expect(result.text).not.toContain(en.remove);
        expect(result.text).not.toContain(en.add_a_user);
        expect(result.text).toContain(en.search);
        expect(result.text).toContain(en.cancel_search);
        expect(result.text).toContain(expectedTitle);
    });
});
