import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/access-denied.json";
import * as cy from "../../../../locales/cy/access-denied.json";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

describe("GET /authorised-agent/access-denied", () => {
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
            expect(response.text).toContain(lang.you_are_not_authorized_to_access);
            expect(response.text).toContain(lang.this_may_be_due_to_lack_of_association);
            expect(response.text).toContain(lang.you_can_return_back_to);
            expect(response.text).toContain(lang.search_company_page);
            expect(response.text).toContain(lang.or_contact_companies_house);
        });
});
