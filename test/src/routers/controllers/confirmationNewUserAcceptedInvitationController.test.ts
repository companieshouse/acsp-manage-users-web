import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { confirmationNewUserAcceptedInvitationControllerGet } from "../../../../src/routers/controllers/confirmationNewUserAcceptedInvitationController";
import * as constants from "../../../../src/lib/constants";

jest.mock("../../../../src/lib/helpers/acspLogger");

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

describe("confirmationNewUserAcceptedInvitationControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call render with expected view data", async () => {
        // Given
        const request = mockRequest();
        const response = mockResponse();
        const loggedInUserMembership = {
            userRole: "admin",
            acspName: "companyName"
        };
        const translations = { key: "value" };
        mockGetTranslationsForView.mockReturnValue(translations);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        await confirmationNewUserAcceptedInvitationControllerGet(request, response);
        // Then
        expect(response.render).toHaveBeenCalledWith(constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE, {
            companyName: loggedInUserMembership.acspName,
            userRole: loggedInUserMembership.userRole,
            buttonHref: constants.LANDING_URL,
            templateName: constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE,
            lang: translations
        });
    });
});
