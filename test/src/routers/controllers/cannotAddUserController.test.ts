import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as constants from "../../../../src/lib/constants";
import * as en from "../../../../locales/en/cannot-add-user.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/cannot-add-user.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import { session } from "../../../mocks/session.middleware.mock";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const url = "/authorised-agent/cannot-add-user";

describe("GET /authorised-agent/cannot-add-user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and render the page with $langInfo content when lang set to $langVersion",
        async ({ langVersion, lang, langCommon }) => {
            session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);

            expect(response.status).toBe(200);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.this_could_be_because);
            expect(response.text).toContain(lang.if_they_do_not_have_a_companies_house_account);
            expect(response.text).toContain(lang.ask_them_to);
            expect(response.text).toContain(lang.create_sign_in_details_for_companies_house);
            expect(response.text).toContain(lang.this_is_different_to_a_webfiling_account);
            expect(response.text).toContain(lang.the_user_will_need_to_do_this);
            expect(response.text).toContain(lang.if_theyve_already_been_added);
            expect(response.text).toContain(lang.you_can_either);
            expect(response.text).toContain(lang.you_can_either_bullet_points[0]);
            expect(response.text).toContain(lang.you_can_either_bullet_points[0]);
            expect(response.text).toContain(lang.manage_users_for);
            expect(response.text).toContain(langCommon.back_link);
            expect(response.text).toContain(constants.CHECK_MEMBER_DETAILS_FULL_URL);
            expect(response.text).toContain(constants.SIGN_IN_URL);
            expect(response.text).toContain(constants.MANAGE_USERS_FULL_URL);
            expect(response.text).toContain(loggedAccountOwnerAcspMembership.acspName);
        });
});
