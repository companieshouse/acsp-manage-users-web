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
            templateName: constants.ACCESSIBILITY_STATEMENT_PAGE
        });
    });

});
