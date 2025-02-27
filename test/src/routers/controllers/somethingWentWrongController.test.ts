import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as constants from "../../../../src/lib/constants";
import * as en from "../../../../locales/en/something-went-wrong.json";
import * as cy from "../../../../locales/cy/something-went-wrong.json";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);
const url = "/authorised-agent/something-went-wrong";

describe("GET /authorised-agent/stop-page-add-account-owner", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        { statusCode: 403, langInfo: "English", langVersion: "en", condition: "it is a CSRF error", lang: en, csrfError: true },
        { statusCode: 403, langInfo: "English", langVersion: undefined, condition: "it is a CSRF error", lang: en, csrfError: true },
        { statusCode: 403, langInfo: "Welsh", langVersion: "cy", condition: "it is a CSRF error", lang: cy, csrfError: true },
        { statusCode: 500, langInfo: "English", langVersion: "en", condition: "it is not a CSRF error", lang: en, csrfError: false },
        { statusCode: 500, langInfo: "English", langVersion: undefined, condition: "it is not a CSRF error", lang: en, csrfError: false },
        { statusCode: 500, langInfo: "Welsh", langVersion: "cy", condition: "it is not a CSRF error", lang: cy, csrfError: false }
    ])("should return status code $statusCode and expected $langInfo content if language set to '$langVersion' and $condition",
        async ({ statusCode, langVersion, lang, csrfError }) => {
            // Given
            const csrfErrorString = csrfError ? `${constants.CSRF_ERRORS}` : "";
            const langString = langVersion ? `lang=${langVersion}` : "";
            let queryString = "";
            if (langVersion && csrfError) {
                queryString = `?${langString}&${csrfErrorString}`;
            } else if (langVersion || csrfError) {
                queryString = langVersion ? `?${langString}` : `?${csrfErrorString}`;
            }
            // When
            const response = await router.get(`${url}${queryString}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.statusCode).toEqual(statusCode);
            if (statusCode === 403) {
                expect(response.text).toContain(lang.sorry_something_went_wrong);
                expect(response.text).toContain(lang.we_have_not_been_able_to_save);
                expect(response.text).toContain(lang.try_the_following);
                expect(response.text).toContain(lang.use_the_back_link);
                expect(response.text).toContain(lang.sign_out_of_the_service);
                expect(response.text).toContain(lang.if_the_problem_continues);
                expect(response.text).toContain(lang.contact_us_link);
                expect(response.text).toContain(lang.for_help);
            } else {
                expect(response.text).toContain(lang.sorry_there_is_problem_with_the_service);
                expect(response.text).toContain(lang.try_again_later);
                expect(response.text).toContain(lang.contact_companies_house);
                expect(response.text).toContain(lang.if_you_have_questions);
            }

        });
});
