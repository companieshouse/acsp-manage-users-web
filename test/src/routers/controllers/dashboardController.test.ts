/* eslint-disable import/first */
process.env.FEATURE_FLAG_SHOW_TELL_US_YOUVE_VERIFIED_A_PERSONS_IDENTITY = "true";
import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/dashboard.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/dashboard.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

import {
    accountOwnerAcspMembership,
    administratorAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";
import { session } from "../../../mocks/session.middleware.mock";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);
const url = "/authorised-agent/";
describe(`GET ${url}`, () => {
    const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    it("should have a page title and 5 boxes, file as an auth agent, manage users, verify, close and update when account owner logged in", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(encodedResponse.status).toEqual(200);
        expect(decodedResponse).toContain(en.add_users_if_they_need_to_use_services_for);
        expect(decodedResponse).toContain(en.authorised_agent_services);
        expect(decodedResponse).toContain(en.authorised_agent_status);
        expect(decodedResponse).toContain(en.authorised_agent_number);
        expect(decodedResponse).toContain(en.your_role);
        expect(decodedResponse).toContain(en.authorised_agents_are_also_known_as);
        expect(decodedResponse).toContain(en.coming_soon);
        expect(decodedResponse).toContain(en.file_as_an_authorised_agent);
        expect(decodedResponse).toContain(en.in_future);
        expect(decodedResponse).toContain(en.manage_users);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.remove_users);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.tell_us_about_any_changes_within);
        expect(decodedResponse).toContain(en.tell_us_about_changes);
        expect(decodedResponse).toContain(en.business_details);
        expect(decodedResponse).toContain(en.anti_money_laundering_registration_details_for);
        expect(decodedResponse).toContain(en.authorised_agent_details);
        expect(decodedResponse).toContain(en.view_users_who_have_been_added);
        expect(decodedResponse).toContain(en.warning);
        expect(decodedResponse).toContain(enCommon.you_can);
        expect(decodedResponse).toContain(en.tell_us_if_you_need_to_close);
        expect(decodedResponse).toContain(en.if_you_close_this_account);
        expect(decodedResponse).toContain(en.will_no_longer_be_registered);
        expect(decodedResponse).toContain(en.users_for_the_authorised_agent);
    });

    it("should have a page title and 3 boxes, file as an auth agent, manage users, and verify when administrator logged in", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(administratorAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(encodedResponse.status).toEqual(200);
        expect(decodedResponse).toContain(en.add_users_if_they_need_to_use_services_for);
        expect(decodedResponse).toContain(en.authorised_agent_number);
        expect(decodedResponse).toContain(en.authorised_agent_services);
        expect(decodedResponse).toContain(en.authorised_agent_status);
        expect(decodedResponse).toContain(en.coming_soon);
        expect(decodedResponse).toContain(en.file_as_an_authorised_agent);
        expect(decodedResponse).toContain(en.in_future);
        expect(decodedResponse).toContain(en.manage_users);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.remove_users);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.view_users_who_have_been_added);
        expect(decodedResponse).toContain(enCommon.you_can);
        expect(decodedResponse).toContain(en.your_role);
        expect(decodedResponse).toContain(en.users_for_the_authorised_agent);
    });

    it("should have a page title and 3 boxes, file as an auth agent, view users, and verify when standard user logged in", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(standardUserAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(encodedResponse.status).toEqual(200);
        expect(decodedResponse).toContain(en.authorised_agent_number);
        expect(decodedResponse).toContain(en.authorised_agent_services);
        expect(decodedResponse).toContain(en.authorised_agent_status);
        expect(decodedResponse).toContain(en.coming_soon);
        expect(decodedResponse).toContain(en.file_as_an_authorised_agent);
        expect(decodedResponse).toContain(en.in_future);
        expect(decodedResponse).toContain(en.view_users);
        expect(decodedResponse).toContain(en.you_can_view_all_users_who);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.your_role);
        expect(decodedResponse).toContain(en.users_for_the_authorised_agent);
    });

    it("should have a page title and 2 boxes manage users and verify when account owner logged in, and feature flags set to false", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(encodedResponse.status).toEqual(200);
        expect(decodedResponse).toContain(en.add_users_if_they_need_to_use_services_for);
        expect(decodedResponse).toContain(en.authorised_agent_number);
        expect(decodedResponse).toContain(en.authorised_agent_services);
        expect(decodedResponse).toContain(en.authorised_agent_status);
        expect(decodedResponse).toContain(en.coming_soon);
        expect(decodedResponse).toContain(en.manage_users);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.remove_users);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.view_users_who_have_been_added);
        expect(decodedResponse).toContain(enCommon.you_can);
        expect(decodedResponse).toContain(en.your_role);
        expect(decodedResponse).toContain(en.authorised_agents_are_also_known_as);
    });

    it("should display Welsh content when language preference in session is Welsh", async () => {
        // Given
        session.setLanguage("cy");

        getLoggedUserAcspMembershipSpy.mockReturnValue(standardUserAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(encodedResponse.status).toEqual(200);
        expect(decodedResponse).toContain(cy.authorised_agent_number);
        expect(decodedResponse).toContain(cy.authorised_agent_services);
        expect(decodedResponse).toContain(cy.authorised_agent_status);
        expect(decodedResponse).toContain(cy.coming_soon);
        expect(decodedResponse).toContain(cy.file_as_an_authorised_agent);
        expect(decodedResponse).toContain(cy.in_future);
        expect(decodedResponse).toContain(cy.view_users);
        expect(decodedResponse).toContain(cy.you_can_view_all_users_who);
        expect(decodedResponse).toContain(cy.page_header);
        expect(decodedResponse).toContain(cy.tell_companies_house_link_text);
        expect(decodedResponse).toContain(cy.your_role);
    });

    it("should display suspended messages in English when the acsp has a status of suspended", async () => {
        // Given
        session.setLanguage("en");
        const ownerWithSuspendedAcsp = {
            ...accountOwnerAcspMembership,
            acspStatus: "suspended"
        };
        getLoggedUserAcspMembershipSpy.mockReturnValue(ownerWithSuspendedAcsp);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(decodedResponse).toContain(en.you_cannot_tell_us);
        expect(decodedResponse).toContain(en.has_been_suspended);
        expect(decodedResponse).toContain(en.you_cannot_file_as);
        expect(decodedResponse).not.toContain(en.in_future);
        expect(decodedResponse).not.toContain(en.in_future_youll_be_able_to_tell_us);
        expect(decodedResponse).toContain(`${accountOwnerAcspMembership.acspName}${en.suspended_warning_text}`);
    });

    it("should not display suspended messages when the acsp has a status of active", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(decodedResponse).not.toContain(en.you_cannot_tell_us);
        expect(decodedResponse).not.toContain(en.has_been_suspended);
        expect(decodedResponse).not.toContain(en.suspended_warning_text);
    });

    it("should display the authorised agents inset text with the correct link", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);

        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");

        // Then
        expect(decodedResponse).toContain(en.authorised_agents_are_also_known_as);
    });

    it("should display the authorised agents inset text in Welsh when session language is Welsh", async () => {
        // Given
        session.setLanguage("cy");
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);

        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");

        // Then
        expect(decodedResponse).toContain(cy.authorised_agents_are_also_known_as);
    });

    it("should display the link to tell companies house you have verified someones identity when feature enabled", async () => {
        // Given
        session.setLanguage("en");
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");

        // Then
        expect(decodedResponse).toContain(
            `href="/tell-companies-house-you-have-verified-someones-identity?lang=en"`
        );
    });
});
