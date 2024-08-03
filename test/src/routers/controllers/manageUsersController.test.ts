import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/manage-users.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import { mockAcspMembersResource, acspMembership } from "../../../mocks/acsp.members.mock";

const router = supertest(app);

const url = "/authorised-agent/manage-users";
const mockGetAcspMemberships = jest.spyOn(acspMemberService, "getAcspMemberships");
const mockGetMembershipForLoggedInUser = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");
mockGetMembershipForLoggedInUser.mockResolvedValue(mockAcspMembersResource);
mockGetAcspMemberships
    .mockResolvedValue(mockAcspMembersResource);

describe("GET /authorised-agent/manage-users", () => {
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        // Given
        const companyName = acspMembership.acspName;
        const companyNumber = acspMembership.acspName;
        const userEmailAddress = acspMembership.userEmail;
        const userName = acspMembership.userDisplayName;
        sessionUtilsSpy.mockReturnValue("demo@ch.gov.uk");
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
    });
});
