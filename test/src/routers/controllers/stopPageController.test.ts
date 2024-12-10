import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/service-unavailable.json";

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

    it("should return status forbidden status 403", async () => {
        await router.get(url).expect(403);
    });

    it("should return expected English content and details component", async () => {
        // Given
        const response = await router.get(url);
        expect(response.status).toEqual(403);
        // Then
        expect(response.text).toContain(en.sorry_something_went_wrong);
        expect(response.text).toContain(en.we_have_not_been_able_to_save);
        expect(response.text).toContain(en.try_the_following);
    });
});
