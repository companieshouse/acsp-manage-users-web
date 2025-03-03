import mocks from "../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../src/app";
import * as en from "../../locales/en/page-not-found.json";
import * as cy from "../../locales/cy/page-not-found.json";

const router = supertest(app);

jest.mock("../../src/lib/Logger");

describe("routerDispatch", () => {
    test.each([
        ["English", "en", en],
        ["English", undefined, en],
        ["Welsh", "cy", cy]
    ])("should return status 404 and render a %s page not found error page if the URL points at a page that does not exist and language set to '%s'",
        async (_langInfo, langVersion, lang) => {
            // Given
            const url = "/authorised-agent/page-that-does-not-exist";
            const langConfig = langVersion ? `?lang=${langVersion}` : "";
            // When
            const response = await router.get(`${url}${langConfig}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.status).toEqual(404);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.if_you_typed_the_web_address);
            expect(response.text).toContain(lang.if_you_pasted_the_web_address);
            expect(response.text).toContain(lang.if_the_web_address_is_correct);
            expect(response.text).toContain(lang.contact_companies_house);
        });
});
