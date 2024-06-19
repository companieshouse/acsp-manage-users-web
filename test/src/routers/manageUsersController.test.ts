import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";

const router = supertest(app);

const url = "/acsp-manage-users";

describe("GET /acsp-manage-users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });
});
