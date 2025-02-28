import { removeUserCheckDetailsControllerGet } from "../../../../src/routers/controllers/removeUserCheckDetailsController";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as constants from "../../../../src/lib/constants";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as helpers from "../../../../src/lib/helpers/fetchAndValidateMembership";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

jest.mock("../../../../src/lib/helpers/fetchAndValidateMembership");

describe("removeUserCheckDetailsControllerGet", () => {
    const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
    const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
    const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

    const loggedInUserMembership = {
        id: "123",
        userId: "123",
        userRole: "admin",
        acspNumber: "123",
        acspName: "companyName",
        displayNameOrEmail: "Jeremy Lloris",
        userDisplayName: "Jeremy Lloris",
        userEmail: "jeremy.lloris@gmail.com"
    };
    const userDetails = [{
        id: "111111",
        userId: "12345",
        userEmail: "james.morris@gmail.com",
        userDisplayName: "James Morris",
        acspNumber: "B149YU",
        displayNameOrEmail: "James Morris",
        userRole: "standard"
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should call render with correct details", async () => {
        getExtraDataSpy.mockReturnValue({});
        const request = mockRequest();
        const response = mockResponse();
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockGetTranslationsForView.mockReturnValue({});
        getExtraDataSpy.mockReturnValue({ "acspMemberships:page:0:role:admin": JSON.stringify({ items: userDetails }) });
        request.query = {};
        request.query.userRole = "admin";
        request.query.page = "1";
        request.params.id = "111111";
        await removeUserCheckDetailsControllerGet(request, response);
        expect(response.render).toHaveBeenCalledWith(constants.REMOVE_MEMBER_PAGE,
            {
                backLinkUrl: "/authorised-agent/manage-users",
                companyName: "companyName",
                lang: {},
                removingThemselves: false,
                tryRemovingUserUrl: "/authorised-agent/try-removing-user",
                userDetails: "James Morris",
                displayNameInFirstParagraph: "James Morris (james.morris@gmail.com)",
                templateName: constants.REMOVE_MEMBER_PAGE
            });
    });

    it("should error with invalid id param ", async () => {
        getExtraDataSpy.mockReturnValue({});
        const request = mockRequest();
        const response = mockResponse();
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockGetTranslationsForView.mockReturnValue({});
        getExtraDataSpy.mockReturnValue(userDetails);
        request.params.id = "";
        await expect(removeUserCheckDetailsControllerGet(request, response))
            .rejects
            .toThrow("invalid id param");
    });

    it("should error when user not authorised ", async () => {
        const standardMember = {
            id: "123",
            userId: "123",
            userRole: "standard",
            acspNumber: "123",
            acspName: "companyName",
            displayNameOrEmail: "Jeremy Lloris"
        };
        getExtraDataSpy.mockReturnValue({});
        const request = mockRequest();
        const response = mockResponse();
        getLoggedUserAcspMembershipSpy.mockReturnValue(standardMember);
        mockGetTranslationsForView.mockReturnValue({});
        getExtraDataSpy.mockReturnValue(userDetails);
        request.params.id = "";
        await expect(removeUserCheckDetailsControllerGet(request, response))
            .rejects
            .toThrow("user not authorised to remove, role is standard");
    });

    it("should fetch member from api when not found in session and render correct data", async () => {
        const standardMember = {
            id: "idNotInSession",
            userId: "userId",
            userRole: UserRole.STANDARD,
            acspNumber: "123",
            userEmail: "user@email.com",
            userDisplayName: "Jeremy Lloris",
            displayNameOrEmail: "Jeremy Lloris"
        };
        (helpers.fetchAndValidateMembership as jest.Mock).mockResolvedValue(standardMember);

        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockGetTranslationsForView.mockReturnValue({});
        getExtraDataSpy.mockReturnValue(userDetails);
        const request = mockRequest();
        const response = mockResponse();
        request.params.id = "idNotInSession";

        await removeUserCheckDetailsControllerGet(request, response);
        expect(response.render).toHaveBeenCalledWith(constants.REMOVE_MEMBER_PAGE,
            {
                backLinkUrl: "/authorised-agent/manage-users",
                companyName: "companyName",
                lang: {},
                removingThemselves: false,
                tryRemovingUserUrl: "/authorised-agent/try-removing-user",
                userDetails: "Jeremy Lloris",
                displayNameInFirstParagraph: "Jeremy Lloris (user@email.com)",
                templateName: constants.REMOVE_MEMBER_PAGE
            });
    });

    it("should error when admin trys to remove owner", async () => {
        const owner = [{
            id: "111111",
            userId: "12345",
            userEmail: "james.morris@gmail.com",
            userDisplayName: "James Morris",
            acspNumber: "B149YU",
            displayNameOrEmail: "James Morris",
            userRole: "owner"
        }];
        getExtraDataSpy.mockReturnValue({});
        const request = mockRequest();
        const response = mockResponse();
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockGetTranslationsForView.mockReturnValue({});
        getExtraDataSpy.mockReturnValue(owner);
        getExtraDataSpy.mockReturnValue({ "acspMemberships:page:0:role:owner": JSON.stringify({ items: owner }) });
        request.query = {};
        request.query.userRole = "owner";
        request.query.page = "1";
        request.params.id = "111111";
        await expect(removeUserCheckDetailsControllerGet(request, response))
            .rejects
            .toThrow("Admin user cannot remove an owner");
    });

    it("should set remove themselves to true", async () => {
        getExtraDataSpy.mockReturnValue({});
        const request = mockRequest();
        const response = mockResponse();
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        mockGetTranslationsForView.mockReturnValue({});
        getExtraDataSpy.mockReturnValue([loggedInUserMembership]);
        getExtraDataSpy.mockReturnValue({ "acspMemberships:page:0:role:admin": JSON.stringify({ items: [loggedInUserMembership] }) });
        request.query = {};
        request.query.userRole = "admin";
        request.query.page = "1";
        request.params.id = "123";
        await removeUserCheckDetailsControllerGet(request, response);
        expect(response.render).toHaveBeenCalledWith(constants.REMOVE_MEMBER_PAGE,
            {
                backLinkUrl: "/authorised-agent/manage-users",
                companyName: "companyName",
                lang: {},
                removingThemselves: true,
                tryRemovingUserUrl: "/authorised-agent/try-removing-user",
                userDetails: loggedInUserMembership.displayNameOrEmail,
                displayNameInFirstParagraph: "Jeremy Lloris (jeremy.lloris@gmail.com)",
                templateName: constants.REMOVE_MEMBER_PAGE
            });
    });
});
