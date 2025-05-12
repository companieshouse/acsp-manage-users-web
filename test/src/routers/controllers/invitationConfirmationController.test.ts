import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/invitation-confirmation.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/invitation-confirmation.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as constants from "../../../../src/lib/constants";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import { session } from "../../../mocks/session.middleware.mock";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const url = "/authorised-agent/invitation-confirmation";
const companyName = loggedAccountOwnerAcspMembership.acspName;

describe("GET /authorised-agent/invitation-confirmation", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    test.each([
        ["English", "en", en, enCommon],
        ["Welsh", "cy", cy, cyCommon]
    ])("should return expected %s content if added user does not currently have a CH account",
        async (_langInfo, langVersion, lang, langCommon) => {

            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(lang.no_ch_account_registered);
            expect(response.text).toContain(lang.the_user_you_are_trying_to_add);
            expect(response.text).toContain(lang.to_access_the_authorised_agent);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(lang.theyll_need_to);
            expect(response.text).toContain(lang.we_have_emailed);
            expect(response.text).toContain(lang.they_will_have_to);
            expect(response.text).toContain(lang.information_confirmation_bullet_point_1);
            expect(response.text).toContain(lang.invitation_confirmation_bullet_point_2);
            expect(response.text).toContain(lang.invitation_confirmation_bullet_point_3);
            expect(response.text).toContain(lang.until_they_have_followed);
            expect(response.text).toContain(langCommon.go_to_manage_users);
        }

    );
});
