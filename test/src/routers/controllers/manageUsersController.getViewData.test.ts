import { getViewData } from "../../../../src/routers/controllers/manageUsersController";
import { mockRequest } from "../../../mocks/request.mock";
import { Membership } from "../../../../src/types/membership";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

export const acspMembers = [{
    id: "111111",
    userId: "12345",
    userEmail: "james.morris@gmail.com",
    displayUserName: "James Morris",
    acspNumber: "B149YU",
    userRole: UserRole.OWNER
} as Membership, {
    id: "999999",
    userId: "54321",
    userEmail: "jeremy.lloris@gmail.com",
    acspNumber: "P1399I",
    userRole: UserRole.OWNER
} as Membership];

describe("manageUsersController - getViewData", () => {
    it("should return the correct view data object", () => {
        // Given
        const request = mockRequest();
        mockGetTranslationsForView.mockReturnValueOnce({});

        // When
        const result = getViewData(request, acspMembers);
        // Then
        expect(result).toBe({
            accountOwnersTableData: [],
            standardUsersTableData: [],
            addUserUrl: "/authorised-agent/add-user?cf=true",
            administratorsTableData: expect.anything(),
            backLinkUrl: "/authorised-agent/dashboard",
            companyName: "MORRIS ACCOUNTING LTD",
            companyNumber: "0122239",
            lang: expect.anything(),
            loggedInUserRole: "standard",
            removeUserLinkUrl: "/authorised-agent/remove-member/:id",
            membership: expect.anything()
        });
    });
});
