import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/dashboard.json";
import * as cy from "../../../../src/locales/cy/translation/dashboard.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { accountOwnerAcspMembership, administratorAcspMembership, standardUserAcspMembership } from "../../../mocks/acsp.members.mock";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";

const router = supertest(app);
const url = "/authorised-agent/";
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

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
    });

    it("should have a page title and 4 boxes, file as an auth agent, manage users, verify and update when account owner legged in", async () => {
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
        expect(decodedResponse).toContain(en.file_as_an_authorised_agent);
        expect(decodedResponse).toContain(en.in_the_future);
        expect(decodedResponse).toContain(en.in_the_future_you_can_use_this_service);
        expect(decodedResponse).toContain(en.manage_users);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.remove_users);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.tell_us_about_aml);
        expect(decodedResponse).toContain(en.tell_us_about_any_changes);
        expect(decodedResponse).toContain(en.update_authorised_agent);
        expect(decodedResponse).toContain(en.users_who_have_been_added);
        expect(decodedResponse).toContain(en.view_users_who_have_been_added);
        expect(decodedResponse).toContain(en.warning);
        expect(decodedResponse).toContain(en.you_can);
        expect(decodedResponse).toContain(en.you_will_need_to_use);
        expect(decodedResponse).toContain(en.your_role);
    });

    it("should have a page title and 3 boxes, file as an auth agent, manage users, and verify when administrator legged in", async () => {
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
        expect(decodedResponse).toContain(en.in_the_future);
        expect(decodedResponse).toContain(en.in_the_future_you_can_use_this_service);
        expect(decodedResponse).toContain(en.manage_users);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.remove_users);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.users_who_have_been_added);
        expect(decodedResponse).toContain(en.view_users_who_have_been_added);
        expect(decodedResponse).toContain(en.you_can);
        expect(decodedResponse).toContain(en.you_will_need_to_use);
        expect(decodedResponse).toContain(en.your_role);
    });

    it("should have a page title and 3 boxes, file as an auth agent, view users, and verify when standard user legged in", async () => {
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
        expect(decodedResponse).toContain(en.in_the_future);
        expect(decodedResponse).toContain(en.in_the_future_you_can_use_this_service);
        expect(decodedResponse).toContain(en.view_users);
        expect(decodedResponse).toContain(en.view_users_who_have_been_added_to);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.tell_companies_house_id);
        expect(decodedResponse).toContain(en.you_will_need_to_use);
        expect(decodedResponse).toContain(en.your_role);
    });

    it("should display Welsh content when language preference in session is Welsh", async () => {
        // Given
        session.setExtraData("lang", "cy");

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
        expect(decodedResponse).toContain(cy.in_the_future);
        expect(decodedResponse).toContain(cy.in_the_future_you_can_use_this_service);
        expect(decodedResponse).toContain(cy.view_users);
        expect(decodedResponse).toContain(cy.view_users_who_have_been_added_to);
        expect(decodedResponse).toContain(cy.page_header);
        expect(decodedResponse).toContain(cy.tell_companies_house_id);
        expect(decodedResponse).toContain(cy.you_will_need_to_use);
        expect(decodedResponse).toContain(cy.your_role);
    });

    it("should display suspended messages in English when the acsp has a status of suspended", async () => {
        // Given
        session.setExtraData("lang", "en");
        const ownerWithSuspendedAcsp = {
            ...accountOwnerAcspMembership,
            acspStatus: "suspended"
        };
        getLoggedUserAcspMembershipSpy.mockReturnValue(ownerWithSuspendedAcsp);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(decodedResponse).toContain(en.service_unavailable_suspension);
        expect(decodedResponse).toContain(en.cant_file_suspension);
        expect(decodedResponse).toContain(`${accountOwnerAcspMembership.acspName}${en.suspended_warning_text}`);
    });
    it("should not display suspended messages when the acsp has a status of live", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(decodedResponse).not.toContain(en.service_unavailable_suspension);
        expect(decodedResponse).not.toContain(en.cant_file_suspension);
        expect(decodedResponse).not.toContain(en.suspended_warning_text);
    });
});
