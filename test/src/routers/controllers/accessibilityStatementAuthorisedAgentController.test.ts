import { Request, Response } from "express";
import { accessibilityStatementAuthorisedAgentControllerGet } from "../../../../src/routers/controllers/accessibilityStatementAuthorisedAgentController";
import * as constants from "../../../../src/lib/constants";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";

describe("accessibilityStatementAuthorisedAgentControllerGet", () => {
    const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

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

    it("should render the accessibility statement page with correct translations", async () => {
        mockGetTranslationsForView.mockReturnValue({});
        await accessibilityStatementAuthorisedAgentControllerGet(req as Request, res as Response);

        expect(mockRender).toHaveBeenCalledWith(constants.ACCESSIBILITY_STATEMENT_PAGE, {
            lang: {},
            templateName: constants.ACCESSIBILITY_STATEMENT_PAGE,
            urls: {
                ABILITY_NET_ADVICE_URL: constants.ABILITY_NET_ADVICE_URL,
                ACCESSIBILITY_SUPPORT_GUIDANCE_URL: constants.ACCESSIBILITY_SUPPORT_GUIDANCE_URL,
                DIGITAL_ACCESSIBILITY_CENTRE_URL: constants.DIGITAL_ACCESSIBILITY_CENTRE_URL,
                EQUALITY_ADVISOR_SERVICE_URL: constants.EQUALITY_ADVISOR_SERVICE_URL,
                GOV_ACCESSIBILITY_URL: constants.GOV_ACCESSIBILITY_URL,
                USABILITY_BLOG_URL: constants.USABILITY_BLOG_URL,
                USER_PANEL_URL: constants.USER_PANEL_URL,
                WCAG_URL: constants.WCAG_URL
            }

        });
    });

});
