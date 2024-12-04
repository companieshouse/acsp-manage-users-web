import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/confirmation-member-removed.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as constants from "../../../../src/lib/constants";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { session } from "../../../mocks/session.middleware.mock";

const router = supertest(app);

const url = "/authorised-agent/confirmation-member-removed";
const companyName = "MORRIS ACCOUNTING LTD";
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const loggedInUserMembership = {
    id: "123;",
    userId: "123",
    userRole: "admin",
    acspNumber: "123",
    acspName: companyName
};

const userDetails = {
    id: "111111",
    userId: "12345",
    userEmail: "james.morris@gmail.com",
    userDisplayName: "James Morris",
    acspNumber: "E12FPL",
    displayNameOrEmail: "James Morris"
};

describe("GET /authorised-agent/confirmation-member-removed", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        session.setExtraData(constants.DETAILS_OF_USER_TO_REMOVE, userDetails);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockNavigationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if person has been removed and userName is provided", async () => {

        // Given

        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        setExtraData(session, constants.DETAILS_OF_USER_TO_REMOVE, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(`${en.you_have_removed}${userDetails.userDisplayName}`);
        expect(response.text).toContain(`${en.from}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_they_have_been_removed);
        expect(response.text).toContain(`${userDetails.userDisplayName}${en.will_no_longer_be_able_to_access}${companyName}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);
    });

    it("should return expected English content if person has been removed and userName is not provided", async () => {

        // Given
        const userDetails = {
            id: "111111",
            userId: "12345",
            userEmail: "james.morris@gmail.com",
            acspNumber: "E12FPL",
            displayNameOrEmail: "James Morris"

        };
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);

        setExtraData(session, constants.DETAILS_OF_USER_TO_REMOVE, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(`${en.you_have_removed}${userDetails.displayNameOrEmail}`);
        expect(response.text).toContain(`${en.from}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_they_have_been_removed);
        expect(response.text).toContain(`${userDetails.displayNameOrEmail}${en.will_no_longer_be_able_to_access}${companyName}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);
    });
});
