import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";

const router = supertest(app);
const url = "/authorised-agent/healthcheck";

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should check user auth before returning the response", async () => {
        await router.get(url);
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        const response = await router.get(url).expect(200);
        expect(response.status).toEqual(200);
        expect(response.text).toContain("OK");
    });
});
