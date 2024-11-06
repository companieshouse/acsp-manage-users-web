import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/confirmation-you-are-removed.json";
import * as constants from "../../../../src/lib/constants";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";

const router = supertest(app);
const url = "/authorised-agent/confirmation-you-are-removed";
const session: Session = new Session();

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

        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toContain(`${en.you_have_removed}`);
        expect(response.text).toContain(`${en.from}`);
        expect(response.text).toContain(en.what_happens_now_you_have_been_removed);
        expect(response.text).toContain(`${en.you_will_no_longer_be_able_to_access}`);
        expect(response.text).toContain(`${en.go_to_companies_house_services}`);
    });

    it("should return expected English content if person has been removed and userName is not provided", async () => {
        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(`${en.you_have_removed}`);
        expect(response.text).toContain(`${en.from}`);
        expect(response.text).toContain(en.what_happens_now_you_have_been_removed);
        expect(response.text).toContain(`${en.you_will_no_longer_be_able_to_access}`);
        expect(response.text).toContain(`${en.go_to_companies_house_services}`);
    });
});
