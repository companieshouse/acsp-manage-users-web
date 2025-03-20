import { Request, Response } from "express";
import { accessibilityStatementAuthorisedAgentControllerGet } from "../../../../src/routers/controllers/accessibilityStatmentAuthorisedAgentController";
import * as constants from "../../../../src/lib/constants";
import * as en from "../../../../locales/en/accessibility-statement.json";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import supertest from "supertest";
import app from "../../../../src/app";
import { session } from "../../../mocks/session.middleware.mock";

const router = supertest(app);
const url = "/authorised-agent/accessibility-statement";

describe("accessibilityStatementAuthorisedAgentControllerGet", () => {
    const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");
    const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockRender: jest.Mock;

    beforeEach(() => {
        req = {
            lang: "en"
        } as Partial<Request>;

        mockRender = jest.fn();
        res = {
            render: mockRender
        } as Partial<Response>;

        jest.clearAllMocks();
    });


    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });



    it("should render the accessibility statement page with correct translations", async () => {
        mockGetTranslationsForView.mockReturnValue({});
        await accessibilityStatementAuthorisedAgentControllerGet(req as Request, res as Response);

        expect(mockRender).toHaveBeenCalledWith(constants.ACCESSIBILITY_STATEMENT_PAGE, {
            lang: {},
            templateName: constants.ACCESSIBILITY_STATEMENT_PAGE
        });
    });


});
