import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import * as en from "../../../src/locales/en/translation/confirmation-member-removed.json";

const router = supertest(app);

const url = "/authorised-agent/confirmation-member-removed";
const userEmail = "d.jones@example.com";
const companyName = "MORRIS ACCOUNTING LTD";

describe("GET /authorised-agent/confirmation-member-removed", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if person has been removed", async () => {

        const response = await router.get(url);
        expect(response.text).toContain(`${en.you_have_removed}${userEmail}`);
        expect(response.text).toContain(`${en.from}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_they_have_been_removed);
        expect(response.text).toContain(`${userEmail}${en.will_no_longer_be_able_to_access}${companyName}.`);
        expect(response.text).toContain(`${en.go_to_manage_users}`);

    });

});
