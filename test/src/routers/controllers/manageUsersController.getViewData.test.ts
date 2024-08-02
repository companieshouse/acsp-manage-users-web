import { getViewData } from "../../../../src/routers/controllers/manageUsersController";
import { mockRequest } from "../../../mocks/request.mock";
import { Membership } from "../../../../src/types/membership";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

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
    userRole: UserRole.STANDARD
} as Membership, {
    id: "222222",
    userId: "54321",
    userEmail: "jeremy.lloris@gmail.com",
    acspNumber: "P1399I",
    userRole: UserRole.ADMIN
} as Membership];

describe("manageUsersController - getViewData", () => {
    it("should return the correct view data object", () => {
        // Given
        const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");
        getLoggedInUserEmailSpy.mockReturnValue("demo@ch.gov.uk");

        const request = mockRequest();
        mockGetTranslationsForView.mockReturnValueOnce({
            remove: "Remove"
        });

        // When
        const result = getViewData(request, acspMembers);
        // Then
        expect(result).toMatchObject({
            accountOwnersTableData: [[

                { text: "james.morris@gmail.com" },
                { text: "James Morris" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/111111\">Remove <span class=\"govuk-visually-hidden\">james.morris@gmail.com</span></a>"
                }

            ]],
            standardUsersTableData: [[

                { text: "jeremy.lloris@gmail.com" },
                { text: undefined },
                {
                    html: "<a href=\"/authorised-agent/remove-member/999999\">Remove <span class=\"govuk-visually-hidden\">jeremy.lloris@gmail.com</span></a>"
                }

            ]],
            administratorsTableData: [[

                { text: "jeremy.lloris@gmail.com" },
                { text: undefined },
                {
                    html: "<a href=\"/authorised-agent/remove-member/222222\">Remove <span class=\"govuk-visually-hidden\">jeremy.lloris@gmail.com</span></a>"
                }

            ]],
            addUserUrl: "/authorised-agent/add-user?cf=true",
            backLinkUrl: "/authorised-agent/",
            companyName: "MORRIS ACCOUNTING LTD",
            companyNumber: "0122239",
            lang: expect.anything(),
            loggedInUserRole: "owner",
            removeUserLinkUrl: "/authorised-agent/remove-member/:id",
            membership: expect.anything()
        });
    });
});
