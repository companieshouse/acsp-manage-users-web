import { cancelSearchControllerGet } from "../../../../src/routers/controllers/cancelSearchControllerGet";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { loggedAccountOwnerAcspMembership, standardUserAcspMembership } from "../../../mocks/acsp.members.mock";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../src/lib/helpers/acspLogger");

const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const deleteExtraDataExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");

export const session = new Session();

const request = mockRequest();
const response = mockResponse();

describe("cancelSearchControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete search string in session and redirect to manage users when user is an owner", async () => {
        // Given
        request.session = session;
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        // When
        cancelSearchControllerGet(request, response);
        // Then
        expect(deleteExtraDataExtraDataSpy).toHaveBeenCalledWith(expect.anything(), "searchStringEmail");
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");
    });

    it("should delete search string in session and redirect to view users when user is a standard user", async () => {
        // Given
        request.session = session;
        getLoggedUserAcspMembershipSpy.mockReturnValue(standardUserAcspMembership);
        // When
        cancelSearchControllerGet(request, response);
        // Then
        expect(deleteExtraDataExtraDataSpy).toHaveBeenCalledWith(expect.anything(), "searchStringEmail");
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/view-users");
    });
});
