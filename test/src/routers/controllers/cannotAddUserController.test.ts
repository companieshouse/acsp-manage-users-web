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
    ])("should return status 200 and render a page with expected $langInfo content if lang is $langVersion",
        async ({ lang, langCommon, langVersion }) => {
            session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
            const response = await router.get(langVersion ? `${url}?lang=${langVersion}` : url);

            expect(response.status).toBe(200);
            expect(response.text).toContain(`${lang.page_header}${langCommon.title_end}`);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.cannot_add_user_paragraph1);
            expect(response.text).toContain(lang.cannot_add_user_paragraph2);
            expect(response.text).toContain(langCommon.back_link);
            expect(response.text).toContain(constants.CHECK_MEMBER_DETAILS_FULL_URL);
            expect(response.text).toContain(constants.MANAGE_USERS_FULL_URL);
            expect(response.text).toContain(loggedAccountOwnerAcspMembership.acspName);
        });
});
