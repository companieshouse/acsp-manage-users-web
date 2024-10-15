import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as constants from "../../../../src/lib/constants";
import * as en from "../../../../locales/en/add-user.json";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as userAccountService from "../../../../src/services/userAccountService";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import {
    administratorAcspMembership,
    loggedAccountOwnerAcspMembership, ToyStoryBuzzAcspMembership
} from "../../../mocks/acsp.members.mock";

const router = supertest(app);
const url = "/authorised-agent/add-user";
const session: Session = new Session();

const mockUserAccService = jest.spyOn(userAccountService, "getUserDetails");

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");

describe(`GET ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should display page content - form information and all radio buttons for selecting role if account owner logged in", async () => {
        // Given
        sessionUtilsSpy.mockReturnValue("demo@ch.gov.uk");
        // When
        const encodedResponse = await router.get(url);
        expect(encodedResponse.status).toEqual(200);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.bullet_1);
        expect(decodedResponse).toContain(en.bullet_2);
        expect(decodedResponse).toContain(en.email_hint_text);
        expect(decodedResponse).toContain(en.option_1);
        expect(decodedResponse).toContain(en.option_2);
        expect(decodedResponse).toContain(en.option_3);
    });

    it("should display page content - form information and administrator and standard user radio buttons for selecting role if administrator logged in", async () => {
        // Given
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, administratorAcspMembership);
        // When
        const encodedResponse = await router.get(url);
        expect(encodedResponse.status).toEqual(200);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");
        // Then
        expect(decodedResponse).toContain(en.page_header);
        expect(decodedResponse).toContain(en.bullet_1);
        expect(decodedResponse).toContain(en.bullet_2);
        expect(decodedResponse).toContain(en.email_hint_text);
        expect(decodedResponse).not.toContain(en.option_1);
        expect(decodedResponse).toContain(en.option_2);
        expect(decodedResponse).toContain(en.option_3);
    });

    it("should validate and display invalid input and error if input stored in session", async () => {
        // Given
        const invalidEmail = "bad email";
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: invalidEmail
        });
        // When
        const response = await router.get(`${url}`);
        // Then
        expect(response.text).toContain("Enter an email address in the correct format");
        expect(response.text).toContain(invalidEmail);
    });

    it("should not display saved session values when url has cf query param - /authorised-agent/add-user?cf=true", async () => {
        // Given
        sessionUtilsSpy.mockReturnValue("demo@ch.gov.uk");
        const emailStoredInSession = "bob@bob.com";
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: emailStoredInSession
        });
        // When
        const response = await router.get(`${url}?cf=true`);
        // Then
        expect(response.text).not.toContain(emailStoredInSession);
        expect(response.text).not.toContain("Enter an email address in the correct format");
        expect(response.text).toContain(en.page_header);
        expect(response.text).toContain(en.option_1);
    });

    it("should display page with error message instead of clearing session data if referrer url contains hrefB (user has switched languages)", async () => {
        // Given
        const invalidEmail = "bad email";
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: invalidEmail
        });
        const newUrl = "/authorised-agent/add-user?lang=en";
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: "/authorised-agent/add-user?lang=cy" };
            req.session = session;
            next();
        });
        // When
        const response = await router.get(`${newUrl}`);

        // Then
        expect(response.text).toContain("Enter an email address in the correct format");
        expect(response.text).toContain(invalidEmail);
    });
});

describe(`POST ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, ToyStoryBuzzAcspMembership);
    });

    it("should check session, user auth and ACSP membership before routing to controller", async () => {
        await router.post(url).send({ email: "", userRole: "" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    it("should display current page with error message if no email provided", async () => {
        const response = await router.post(url).send({ email: "" });
        expect(response.text).toContain(en.errors_email_required);
        expect(response.text).toContain(en.errors_select_user_role);
    });

    it("should display current page with error message if email invalid", async () => {
        const response = await router.post(url).send({ email: "abc", userRole: "standard" });
        expect(response.text).toContain(en.errors_email_invalid);
        expect(response.text).not.toContain(en.errors_select_user_role);
    });

    it("should redirect to the check member details page when form inputs valid and user details found", async () => {
        mockUserAccService.mockResolvedValueOnce([{
            forename: "Bob",
            surname: "McBob",
            email: "bob@bob.com"
        }]);
        const response = await router.post(url).send({ email: "bob@bob.com", userRole: "standard" });
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.CHECK_MEMBER_DETAILS_FULL_URL);
    });
});
