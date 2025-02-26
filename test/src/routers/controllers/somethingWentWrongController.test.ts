import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/something-went-wrong.json";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);
const url = "/authorised-agent/something-went-wrong";

describe("GET /authorised-agent/stop-page-add-account-owner", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return expected English content and details component", async () => {
        // Given
        const response = await router.get(url);
        expect(response.statusCode).toEqual(500);
        // Then
        expect(response.text).toContain(en.sorry_there_is_problem_with_the_service);
        expect(response.text).toContain(en.try_again_later);
        expect(response.text).toContain(en.contact_companies_house);
        expect(response.text).toContain(en.if_you_have_questions);
    });
});
