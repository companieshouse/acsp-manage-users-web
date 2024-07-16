import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import * as constants from "../../../src/lib/constants";
import * as en from "../../../src/locales/en/translation/add-user.json";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";

const router = supertest(app);
const url = "/authorised-agent/add-user";
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

describe(`GET ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should display page content - form information and radio button for selecting role", async () => {
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

    it("should validate and display invalid input and error if input stored in session", async () => {
        const invalidEmail = "bad email";
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: invalidEmail
        });

        const response = await router.get(`${url}`);

        expect(response.text).toContain("Enter an email address in the correct format");
        expect(response.text).toContain(invalidEmail);
    });

    it("should not display saved session values when url has cf query param - /authorised-agent/add-user?cf=true", async () => {
        const emailStoredInSession = "bob@bob.com";
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: emailStoredInSession
        });
        const response = await router.get(`${url}?cf=true`);

        expect(response.text).not.toContain(emailStoredInSession);
        expect(response.text).not.toContain("Enter an email address in the correct format");
        expect(response.text).toContain(en.page_header);
        expect(response.text).toContain(en.option_1);
    });
});

describe(`POST ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before routing to controller", async () => {
        await router.post(url).send({ email: "", userRole: "" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
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

    it("should redirect to the next page when form inputs are valid", async () => {
        const response = await router.post(url).send({ email: "bob@bob.com", userRole: "standard" });
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.CHECK_MEMBER_DETAILS_FULL_URL);
    });
});
