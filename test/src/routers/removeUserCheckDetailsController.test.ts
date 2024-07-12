import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import * as en from "../../../src/locales/en/translation/remove-member.json";
import * as enCommon from "../../../src/locales/en/translation/common.json";
import * as constants from "../../../src/lib/constants";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import { setExtraData } from "../../../src/lib/utils/sessionUtils";
import { Membership } from "../../../src/types/membership";

const router = supertest(app);

const url = "/authorised-agent/remove-member";
const companyName = "MORRIS ACCOUNTING LTD";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

describe("GET /authorised-agent/remove-member", () => {

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

    it("should return expected English content and userName is provided", async () => {

        const userDetails: Membership = {
            id: "111111",
            userId: "12345",
            userEmail: "james.morris@gmail.com",
            displayUserName: "James Morris",
            AcspNumber: "B149YU"
        };
        setExtraData(session, constants.MANAGE_USERS_MEMBERSHIP, userDetails);

        const response = await router.get(url);
        expect(response.text).toContain(`${en.remove}${userDetails.displayUserName}`);
        expect(response.text).toContain(`${en.if_you_remove}${userDetails.displayUserName}${en.they_will_not_be_able_to_use}${companyName}`);
        expect(response.text).toContain(`${en.remove_user}`);
        expect(response.text).toContain(`${enCommon.cancel}`);

    });

    // it("should return expected English content and userName is not provided", async () => {

    //     const userDetails: Membership = {
    //         id: "111111",
    //         userId: "12345",
    //         userEmail: "james.morris@gmail.com",
    //         displayUserName: "James Morris",
    //         AcspNumber: "B149YU"
    //     };
    //     setExtraData(session, constants.MANAGE_USERS_MEMBERSHIP, userDetails);

    //     const response = await router.get(url);
    //     expect(response.text).toContain(`${en.remove}${userDetails.userEmail}`);
    //     expect(response.text).toContain(`${en.if_you_remove}${userDetails.userEmail}${en.they_will_not_be_able_to_use}${companyName}`);
    //     expect(response.text).toContain(`${en.remove_user}`);
    //     expect(response.text).toContain(`${enCommon.cancel}`);

    // });

});
