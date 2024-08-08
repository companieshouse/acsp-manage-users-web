import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/stop-page-add-account-owner.json";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

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

describe("GET /authorised-agent/confirmation-you-are-removed", () => {

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
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        await router.get(url).expect(200);
    });

    it("should return expected English content if person has been removed and userName is provided", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toContain(en.before_you_remove);
        expect(response.text).toContain(en.manage_users_for);
        expect(response.text).toContain(en.p1);
        expect(response.text).toContain(en.page_header);
        expect(response.text).toContain(`${en.you_need_to_add}${companyName}`);
    });
});
