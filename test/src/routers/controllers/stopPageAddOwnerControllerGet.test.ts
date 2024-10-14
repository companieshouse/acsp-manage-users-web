import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/stop-page-add-account-owner.json";
import * as cy from "../../../../locales/cy/stop-page-add-account-owner.json";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";
import { MemberForRemoval } from "../../../../src/types/membership";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { adminUserRoleChangeDataMock } from "../../../mocks/user.mock";

const router = supertest(app);

const url = "/authorised-agent/stop-page-add-account-owner";
const companyName = "MORRIS ACCOUNTING LTD";

const session: Session = new Session();
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const loggedInUserMembership = {
    id: "123;",
    userId: "123",
    userRole: "admin",
    acspNumber: "123",
    acspName: companyName
};

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

const userDetails: MemberForRemoval = {
    userEmail: "james.morris@gmail.com",
    userDisplayName: "James Morris",
    displayNameOrEmail: "James Morris",
    id: "123",
    userId: "123",
    userRole: UserRole.ADMIN,
    acspNumber: "123"
};

describe("GET /authorised-agent/stop-page-add-account-owner", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        session.deleteExtraData(constants.DETAILS_OF_USER_TO_REMOVE);
        session.deleteExtraData(constants.USER_ROLE_CHANGE_DATA);
    });

    it("should check session and user auth before returning the page", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        ["English", "is removed", "en", en, constants.DETAILS_OF_USER_TO_REMOVE, userDetails],
        ["Welsh", "is removed", "cy", cy, constants.DETAILS_OF_USER_TO_REMOVE, userDetails],
        ["English", "role is changed", "en", en, constants.USER_ROLE_CHANGE_DATA, adminUserRoleChangeDataMock],
        ["Welsh", "role is changed", "cy", cy, constants.USER_ROLE_CHANGE_DATA, adminUserRoleChangeDataMock]
    ])("should return expected %s content if admin user %s and languade set to %s",
        async (_langInfo, _taskInfo, langVersion, lang, key, data) => {
            // Given
            session.setExtraData(key, data);
            getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
            // When
            const encodedResponse = await router.get(`${url}?lang=${langVersion}`);
            const responseText = encodedResponse.text.replace(/&#39;/g, "'");
            // Then
            expect(encodedResponse.status).toEqual(200);
            if (_taskInfo === "is removed") {
                expect(responseText).toContain(lang.before_you_remove);
                expect(responseText).not.toContain(lang.before_you_change_your_role);
                expect(responseText).toContain(`${constants.LANDING_URL}/${constants.REMOVE_MEMBER_PAGE}/${(data as MemberForRemoval).id}`);
            } else {
                expect(responseText).toContain(lang.before_you_change_your_role);
                expect(responseText).not.toContain(lang.before_you_remove);
                expect(responseText).toContain(constants.MANAGE_USERS_FULL_URL);
            }
            expect(responseText).toContain(lang.manage_users_for);
            expect(responseText).toContain(lang.p1);
            expect(responseText).toContain(lang.page_header);
            expect(responseText).toContain(lang.why_authorised_agents_must);
            expect(responseText).toContain(lang.details.p1);
            expect(responseText).toContain(lang.details.p2);
            expect(responseText).toContain(lang.details.p3_start);
            expect(responseText).toContain(lang.details.p3_link_text);
            expect(responseText).toContain(lang.details.p3_end);
            expect(responseText).toContain(`${lang.you_need_to_add}${companyName}`);
        });

    it("should error when no person for removal or role change is in session", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        const response = await router.get(url);
        expect(response.status).toEqual(500);
        // Then
        expect(response.text).toContain("there is a problem with the service");
    });
});
