import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/stop-page-add-account-owner.json";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";
import { MemberForRemoval } from "../../../../src/types/membership";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

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

    it("should check session and user auth before returning the page", async () => {
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        await router.get(url).expect(200);
    });

    it("should return expected English content and details component", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        const encodedResponse = await router.get(url);
        expect(encodedResponse.status).toEqual(200);
        const responseText = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(responseText).toContain(en.before_you_remove);
        expect(responseText).toContain(en.manage_users_for);
        expect(responseText).toContain(en.p1);
        expect(responseText).toContain(en.page_header);
        expect(responseText).toContain(en.why_authorised_agents_must);
        expect(responseText).toContain(en.details.p1);
        expect(responseText).toContain(en.details.p2);
        expect(responseText).toContain(en.details.p3_start);
        expect(responseText).toContain(en.details.p3_link_text);
        expect(responseText).toContain(en.details.p3_end);
        expect(responseText).toContain(`${en.you_need_to_add}${companyName}`);
    });
    it("should error when no person for removal is in session", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, undefined);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        const response = await router.get(url);
        expect(response.status).toEqual(500);
        // Then
        expect(response.text).toContain("there is a problem with the service");
    });
});
