import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../src/locales/en/translation/confirmation-member-added.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as constants from "../../../../src/lib/constants";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { NewUserDetails } from "../../../../src/types/user";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";

const router = supertest(app);

const session: Session = new Session();

const url = "/authorised-agent/confirmation-member-added";
const companyName = loggedAccountOwnerAcspMembership.acspName;

const userRole: UserRole = UserRole.STANDARD;
const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "test@example.com" };
setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

describe("GET /authorised-agent/confirmation-member-added", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
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

    it("should return expected English content if person has been added and if userName is provided", async () => {

        // Given
        const userRole: UserRole = UserRole.STANDARD;
        const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "d.jones@example.com", userName: "Davy Jones" };
        setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.user_added);
        expect(response.text).toContain(en.you_have_added);
        expect(response.text).toContain(userDetails.userName);
        expect(response.text).toContain(`${en.as_a}${en.standard_user}${en.for}${companyName}`);
        expect(response.text).toContain(en.what_happens_now);
        expect(response.text).toContain(`${en.theyll_be_able_to_use_services}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);
    });

    it("should return expected English content if person has been added and userName is not provided", async () => {

        // Given
        const userRole: UserRole = UserRole.STANDARD;
        const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "d.jones@example.com" };
        setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.user_added);
        expect(response.text).toContain(en.you_have_added);
        expect(response.text).toContain(userDetails.email);
        expect(response.text).toContain(`${en.as_a}${en.standard_user}${en.for}${companyName}`);
        expect(response.text).toContain(en.what_happens_now);
        expect(response.text).toContain(`${en.theyll_be_able_to_use_services}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);
    });

    it("should return expected English content if person has been added and userRole is administrator", async () => {

        // Given
        const userRole: UserRole = UserRole.ADMIN;
        const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "k.williams@example.com" };
        setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.user_added);
        expect(response.text).toContain(en.you_have_added);
        expect(response.text).toContain(userDetails.email);
        expect(response.text).toContain(`${en.as_an}${en.administrator}${en.for}${companyName}`);
        expect(response.text).toContain(en.what_happens_now);
        expect(response.text).toContain(`${en.theyll_be_able_to_use_services}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);
    });

    it("should return expected English content if person has been added and userRole is account owner", async () => {

        // Given
        const userRole: UserRole = UserRole.OWNER;
        const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "j.smith@example.com" };
        setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.user_added);
        expect(response.text).toContain(en.you_have_added);
        expect(response.text).toContain(userDetails.email);
        expect(response.text).toContain(`${en.as_an}${en.account_owner}${en.for}${companyName}`);
        expect(response.text).toContain(en.what_happens_now);
        expect(response.text).toContain(`${en.theyll_be_able_to_use_services}`);
        expect(response.text).toContain(`${enCommon.go_to_manage_users}`);
    });

});
