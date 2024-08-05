import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import * as en from "../../../src/locales/en/translation/confirmation-member-removed.json";
import * as enCommon from "../../../src/locales/en/translation/common.json";
import * as constants from "../../../src/lib/constants";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import { setExtraData } from "../../../src/lib/utils/sessionUtils";

const router = supertest(app);

const url = "/authorised-agent/confirmation-member-removed";
const companyName = "MORRIS ACCOUNTING LTD";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

describe("GET /authorised-agent/confirmation-member-removed", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
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
            userDisplayName: "James Morris",
            acspNumber: "E12FPL"
        };
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
            acspNumber: "E12FPL"
        };
        setExtraData(session, constants.DETAILS_OF_USER_TO_REMOVE, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(`${en.you_have_removed}${userDetails.userEmail}`);
        expect(response.text).toContain(`${en.from}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_they_have_been_removed);
        expect(response.text).toContain(`${userDetails.userEmail}${en.will_no_longer_be_able_to_access}${companyName}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);

    });

});
