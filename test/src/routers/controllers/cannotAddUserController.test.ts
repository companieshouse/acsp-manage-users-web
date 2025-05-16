import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as constants from "../../../../src/lib/constants";
import * as en from "../../../../locales/en/cannot-add-user.json";
import * as enCommon from "../../../../locales/en/common.json";
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

    it("should return status 200 and render the correct page with expected content", async () => {
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
        const response = await router.get(url);

        expect(response.status).toBe(200);
        expect(response.text).toContain(en.cannot_add_user_title);
        expect(response.text).toContain(en.cannot_add_user_heading);
        expect(response.text).toContain(en.cannot_add_user_paragraph1);
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(constants.CHECK_MEMBER_DETAILS_FULL_URL);
        expect(response.text).toContain(constants.MANAGE_USERS_FULL_URL);
        expect(response.text).toContain(loggedAccountOwnerAcspMembership.acspName);
    });
});
