import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/confirmation-you-are-removed.json";
import * as constants from "../../../../src/lib/constants";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

const router = supertest(app);

const url = "/authorised-agent/confirmation-you-are-removed";
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
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if person has been removed and userName is provided", async () => {

        // Given
        const userDetails = {
            id: "111111",
            userId: "12345",
            userEmail: "james.morris@gmail.com",
            displayUserName: "James Morris",
            displayNameOrEmail: "James Morris",
            acspNumber: "E12FPL"
        };
        setExtraData(session, constants.DETAILS_OF_USER_TO_REMOVE, userDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(`${en.you_have_removed}${userDetails.displayUserName}`);
        expect(response.text).toContain(`${en.from}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_you_have_been_removed);
        expect(response.text).toContain(`${en.you_will_no_longer_be_able_to_access}${companyName}`);
        expect(response.text).toContain(`${en.go_to_companies_house_services}`);
    });

    it("should return expected English content if person has been removed and userName is not provided", async () => {

        // Given
        const userDetails = {
            id: "111111",
            userId: "12345",
            userEmail: "james.morris@gmail.com",
            acspNumber: "E12FPL",
            displayNameOrEmail: "james.morris@gmail.com"
        };
        setExtraData(session, constants.DETAILS_OF_USER_TO_REMOVE, userDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(`${en.you_have_removed}${userDetails.userEmail}`);
        expect(response.text).toContain(`${en.from}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_you_have_been_removed);
        expect(response.text).toContain(`${en.you_will_no_longer_be_able_to_access}${companyName}`);
        expect(response.text).toContain(`${en.go_to_companies_house_services}`);
    });
});
