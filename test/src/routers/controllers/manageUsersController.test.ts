import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/manage-users.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import * as constants from "../../../../src/lib/constants";
import {
    accountOwnerAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const url = "/authorised-agent/manage-users";
const getAcspMembershipsSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getAcspMemberships");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");

getAcspMembershipsSpy
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
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
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
        expect(result.text).toContain(en.back_link_to_authorised_agent_services);
        expect(result.text).toContain(en.standard_users);
        expect(result.text).toContain(enCommon.email_address);
        expect(result.text).toContain(en.name);
        expect(result.text).toContain(`${en.remove}${en.an_account_owner}`);
        expect(result.text).toContain(`${en.remove}${en.an_administrator}`);
        expect(result.text).toContain(`${en.remove}${en.a_standard_user}`);
        expect(result.text).toContain(en.add_a_user);
        expect(result.text).toContain(en.search);
        expect(result.text).toContain(en.cancel_search);
        expect(result.text).toContain(expectedTitle);
        expect(result.text).toContain("<a data-event-id=\"remove\"");
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
        expect(result.text).toContain(en.back_link_to_authorised_agent_services);
        expect(result.text).toContain(en.standard_users);
        expect(result.text).toContain(enCommon.email_address);
        expect(result.text).toContain(en.name);
        expect(result.text).not.toContain(en.remove_user);
        expect(result.text).not.toContain("<a data-event-id=\"remove\"");
        expect(result.text).not.toContain(en.add_a_user);
        expect(result.text).toContain(en.search);
        expect(result.text).toContain(en.cancel_search);
        expect(result.text).toContain(expectedTitle);
    });
    it("should delete email search string from session when url has cancel search query param", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(standardUserAcspMembership);
        // When
        const response = await router.get(`${url}?${constants.CANCEL_SEARCH}`);
        // Then
        expect(response.text).toContain(en.page_header_standard);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.SEARCH_STRING_EMAIL);
    });
});
