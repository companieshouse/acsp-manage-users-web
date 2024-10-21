import mocks from "../../../mocks/all.middleware.mock";
import { userAdamBrownDetails } from "../../../mocks/user.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../src/lib/constants";
import * as en from "../../../../locales/en/check-member-details.json";
import * as enCommon from "../../../../locales/en/common.json";
import { UserRoleTagEn } from "../../../../src/types/userRoleTagEn";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const router = supertest(app);
const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");

const url = "/authorised-agent/check-member-details";

describe("GET /authorised-agent/check-member-details", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, userAdamBrownDetails);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        // Given
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, userAdamBrownDetails);
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
        const expectedUserRoleTag = UserRoleTagEn.ADMIN;
        const loggedInEmail = "test@test.com";
        getLoggedInUserEmailSpy.mockReturnValue(loggedInEmail);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(200);
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(en.change_details);
        expect(response.text).toContain(en.confirm_and_add_user);
        expect(response.text).toContain(en.page_header);
        expect(response.text).toContain(en.role);
        expect(response.text).toContain(userAdamBrownDetails.email);
        expect(response.text).toContain(expectedUserRoleTag);
        expect(response.text).toContain(loggedInEmail);
    });
});
