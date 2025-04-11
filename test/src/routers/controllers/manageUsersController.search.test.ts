import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/manage-users.json";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import {
    accountOwnerAcspMembership,
    administratorAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const url = "/authorised-agent/manage-users";
const viewUserUrl = "/authorised-agent/view-users";
const getAcspMembershipsSpy = jest.spyOn(acspMemberService, "getAcspMemberships");
const membershipLookupSpy = jest.spyOn(acspMemberService, "membershipLookup");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("manageUsersControllerGet - search", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return an error message if search string is not a valid email address and the input field preserve the provided value", async () => {
        // Given
        const search = "not valid email address";
        getExtraDataSpy.mockReturnValue(search);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        getAcspMembershipsSpy
            .mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership]));
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toContain(en.errors_enter_an_email_address_in_the_correct_format);
        expect(response.text).toContain(search);
    });

    it("should return an expected response if search string is a valid email address that has account owner ACSP membership", async () => {
        // Given
        const search = "james.morris@gmail.com";
        getExtraDataSpy.mockReturnValue(search);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        membershipLookupSpy.mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership]));
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toContain(accountOwnerAcspMembership.userEmail);
        expect(response.text).not.toContain(en.errors_enter_an_email_address_in_the_correct_format);
        expect(response.text).toContain(en.no_search_results);
    });

    it("should return an expected response if search string is a valid email address that has admin ACSP membership", async () => {
        // Given
        const search = "jeremy.lloris@gmail.com";
        getExtraDataSpy.mockReturnValue(search);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        membershipLookupSpy.mockResolvedValue(getMockAcspMembersResource([administratorAcspMembership]));
        // When
        const response = await router.get(url);
        // Then
        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), "manageUsersMembership", expect.anything());
        expect(response.text).toContain(administratorAcspMembership.userEmail);
        expect(response.text).not.toContain(en.errors_enter_an_email_address_in_the_correct_format);
        expect(response.text).toContain(en.no_search_results);
    });

    it("should return an expected response if search string is a valid email address that has standard user ACSP membership", async () => {
        // Given
        const search = "jane.doe@gmail.com";
        getExtraDataSpy.mockReturnValue(search);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        membershipLookupSpy.mockResolvedValue(getMockAcspMembersResource([standardUserAcspMembership]));
        // When
        const response = await router.get(url);
        // Then
        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), "manageUsersMembership", expect.anything());

        expect(response.text).toContain(standardUserAcspMembership.userEmail);
        expect(response.text).not.toContain(en.errors_enter_an_email_address_in_the_correct_format);
        expect(response.text).toContain(en.no_search_results);
    });

    it("should return nothing if search string is a valid email address that has no ACSP membership", async () => {
        // Given
        const search = "test@test.com";
        getExtraDataSpy.mockReturnValue(search);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        membershipLookupSpy.mockRejectedValue(undefined);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).not.toContain(en.errors_enter_an_email_address_in_the_correct_format);
        expect(response.text).toContain(en.no_search_results);
    });

    it("should return nothing if search string is a valid email address that has no ACSP membership", async () => {
        // Given
        const search = "test@test.com";
        getExtraDataSpy.mockReturnValue(search);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        const resource = getMockAcspMembersResource([], 0, 0, 0, 0);
        membershipLookupSpy.mockResolvedValue(resource);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).not.toContain(en.errors_enter_an_email_address_in_the_correct_format);
        expect(response.text).toContain(en.no_search_results);
    });
});

describe("manageUsersControllerPost - search", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.post(url).send({ search: "j.smith@test.com" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to url with search query parameter based on provided search string when user is an account owner", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        const search = "test@test.com";
        const expectedPageHeading = `Found. Redirecting to ${url}`;
        // When
        const response = await router.post(url).send({ search: search });
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });

    it("should redirect to url with search query parameter based on provided search string when user is a standard user", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(standardUserAcspMembership);
        const search = "test@test.com";
        const expectedPageHeading = `Found. Redirecting to ${viewUserUrl}`;
        // When
        const response = await router.post(viewUserUrl).send({ search: search });
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toContain(expectedPageHeading);
    });
});
