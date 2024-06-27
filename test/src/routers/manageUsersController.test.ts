import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import * as en from "../../../src/locales/en/translation/manage-users.json";

const router = supertest(app);

const url = "/authorised-agent/manage-users";

describe("GET /authorised-agent/manage-users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        // Given
        const companyName = "MORRIS ACCOUNTING LTD";
        const companyNumber = "0122239";
        const userEmailAddress = "james.morris@gmail.com";
        const userName = "James Morris";
        // When
        const result = await router.get(url);
        // Then
        expect(result.status).toEqual(200);
        expect(result.text).toContain(userEmailAddress);
        expect(result.text).toContain(userName);
        expect(result.text).toContain(companyName);
        expect(result.text).toContain(companyNumber);
        expect(result.text).toContain(en.page_header);
        expect(result.text).toContain(en.administrators);
        expect(result.text).toContain(en.back_link);
        expect(result.text).toContain(en.standard_users);
        expect(result.text).toContain(en.email_address);
        expect(result.text).toContain(en.users_name);
        expect(result.text).toContain(en.remove_user);
        expect(result.text).toContain(en.remove);
        expect(result.text).toContain(en.you_have_no_admin_users);
        expect(result.text).toContain(en.you_have_no_standard_users);
        expect(result.text).toContain(en.add_a_user);
    });
});
