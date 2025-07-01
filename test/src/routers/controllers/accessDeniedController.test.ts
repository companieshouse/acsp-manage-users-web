import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/access-denied.json";
import * as cy from "../../../../locales/cy/access-denied.json";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

describe("GET /authorised-agent/access-denied", () => {
    const href = "/register-as-companies-house-authorised-agent?lang=";
    test.each([
        ["English", "en", en],
        ["English", undefined, en],
        ["Welsh", "cy", cy]
    ])("should return expected %s content if language set to '%s'",
        async (_langInfo, langVersion, lang) => {
            // Given
            const url = "/authorised-agent/access-denied";
            const langConfig = langVersion ? `?lang=${langVersion}` : "";
            // When
            const response = await router.get(`${url}${langConfig}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.apply_to_register_as_an_authorised_agent);
            expect(response.text).toContain(lang.youll_need_to_ask_to_be_added);
            expect(response.text).toContain(lang.if_theres_not_an_existing_account);
            expect(response.text).toContain(`${href}${langVersion ?? "en"}`);
        });
});
