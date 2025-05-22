import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/before-you-add-user.json";
import * as cy from "../../../../locales/cy/before-you-add-user.json";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

describe("GET /authorised-agent/before-you-add-user", () => {
    const href = ""; // This is a placeholder for the actual href value
    test.each([
        ["English", "en", en],
        ["English", undefined, en],
        ["Welsh", "cy", cy]
    ])("should return expected %s content if language set to '%s'",
        async (_langInfo, langVersion, lang) => {
            // Given
            const url = "/authorised-agent/before-you-add-user";
            const langConfig = langVersion ? `?lang=${langVersion}` : "";
            // When
            const response = await router.get(`${url}${langConfig}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.ask_them_to);
            expect(response.text).toContain(lang.create_sign_in_details);
            expect(response.text).toContain(lang.the_user_will_need_to_do_this);
            expect(response.text).toContain(lang.to_add_someone_as_a_user);
            expect(response.text).toContain(lang.a_companies_house_account_is_used_to_sign_in_to);
            expect(response.text).toContain(lang.a_companies_house_account_is_used_to_sign_in_to_bullet_points[0]);
            expect(response.text).toContain(lang.a_companies_house_account_is_used_to_sign_in_to_bullet_points[1]);
            expect(response.text).toContain(lang.if_the_user_does_not_have_a_companies_house_account);
            expect(response.text).toContain(href);
        });
});
