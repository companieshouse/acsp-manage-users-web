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
        expect(decodedResponse).toContain(en.auth_agent_status);
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.file_as_an_authorised_agent);
        expect(decodedResponse).toContain(en.manage_users);
        expect(decodedResponse).toContain(en.verify_someones_id);
        expect(decodedResponse).toContain(en.update_agent_details);
    });
});
