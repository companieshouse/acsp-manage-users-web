import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import * as en from "../../../src/locales/en/translation/dashboard.json";

const router = supertest(app);
const url = "/authorised-agent/dashboard";

describe(`GET ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should have a page title and 4 boxes, file as an auth agent, manage people, verify and update", async () => {
        // When
        const encodedResponse = await router.get(url);
        expect(encodedResponse.status).toEqual(200);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
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
});
