import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";

const router = supertest(app);

const url = "/dummy";

describe("GET /dummy", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should not check session, user auth and ACSP membership", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).not.toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).not.toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).not.toHaveBeenCalled();
    });

    it("should return status 404", async () => {
        await router.get(url).expect(404);
    });
});
