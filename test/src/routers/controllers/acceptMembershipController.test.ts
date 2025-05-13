import mocks from "../../../mocks/all.middleware.mock";
import { pendingAcspMembership } from "../../../mocks/acsp.members.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/accept-membership.json";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import * as constants from "../../../../src/lib/constants";

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/services/acspMemberService");
jest.mock("../../../../src/lib/utils/sessionUtils");

const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

const router = supertest(app);

const url = "/authorised-agent/accept-membership";

describe("GET /authorised-agent/accept-membership", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getLoggedUserAcspMembershipSpy.mockReturnValue(pendingAcspMembership);
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 and render the accept confirmation page", async () => {
        const response = await router.get(url);
        expect(response.status).toEqual(200);
        expect(response.text).toContain(en.bullet_1);
        expect(response.text).toContain(en.bullet_2);
        expect(response.text).toContain(en.radio_btns_header);
        expect(response.text).toContain(en.details_bullet_1);
        expect(response.text).toContain(en.details_bullet_2);
        expect(response.text).toContain(en.details_bullet_3);
        expect(response.text).toContain(en.yes);
        expect(response.text).toContain(en.no);
    });
});

describe("POST /authorised-agent/accept-membership", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getLoggedUserAcspMembershipSpy.mockReturnValue(pendingAcspMembership);
    });

    it("should handle 'yes' scenario and redirect to invite-confirmation", async () => {
        (acspMemberService.updateOrRemoveUserAcspMembership as jest.Mock).mockResolvedValue(undefined);
        (acspMemberService.getMembershipForLoggedInUser as jest.Mock).mockResolvedValue({
            items: [pendingAcspMembership]
        });

        const response = await router
            .post(url)
            .send({ acceptMembership: "yes" });

        expect(acspMemberService.updateOrRemoveUserAcspMembership).toHaveBeenCalledWith(
            expect.anything(),
            "XME004",
            { updateUser: { userStatus: "active" } }
        );
        expect(sessionUtils.setExtraData).toHaveBeenCalledWith(expect.anything(), "loggedUserAcspMembership", expect.anything());
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_FULL_URL);
    });

    it("should handle 'no' scenario and redirect to sign-out", async () => {
        (acspMemberService.updateOrRemoveUserAcspMembership as jest.Mock).mockResolvedValue(undefined);
        (acspMemberService.getMembershipForLoggedInUser as jest.Mock).mockResolvedValue({
            items: [pendingAcspMembership]
        });

        const response = await router
            .post(url)
            .send({ acceptMembership: "no" });

        expect(acspMemberService.updateOrRemoveUserAcspMembership).toHaveBeenCalledWith(
            expect.anything(),
            "XME004",
            { updateUser: { userStatus: "removed" } }
        );
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(constants.SIGN_OUT_URL);
    });

    it("should handle invalid input and re-render the page with an error", async () => {
        const response = await router
            .post(url)
            .send({ acceptMembership: "invalid-form-data" });

        expect(response.text).toContain(en.bullet_1);
        expect(response.text).toContain(en.bullet_2);
        expect(response.text).toContain(en.radio_btns_header);
        expect(response.text).toContain(en.details_bullet_1);
        expect(response.text).toContain(en.details_bullet_2);
        expect(response.text).toContain(en.details_bullet_3);
        expect(response.text).toContain(en.yes);
        expect(response.text).toContain(en.no);
        expect(response.text).toContain(en.errors_select_an_option);
    });
});
