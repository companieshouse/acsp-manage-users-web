import { getViewData } from "../../../../src/routers/controllers/manageUsersController";
import { mockRequest } from "../../../mocks/request.mock";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import {
    accountOwnerAcspMembership,
    administratorAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");
const mockGetAcspMemberships = jest.spyOn(acspMemberService, "getAcspMemberships");
const mockGetMembershipForLoggedInUser = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");

describe("manageUsersController - getViewData", () => {
    it("should return the correct view data object", async () => {

        const request = mockRequest();
        mockGetTranslationsForView.mockReturnValueOnce({
            remove: "Remove"
        });
        mockGetMembershipForLoggedInUser.mockResolvedValue(getMockAcspMembersResource(loggedAccountOwnerAcspMembership));
        mockGetAcspMemberships
            .mockResolvedValueOnce(getMockAcspMembersResource(accountOwnerAcspMembership))
            .mockResolvedValueOnce(getMockAcspMembersResource(administratorAcspMembership))
            .mockResolvedValue(getMockAcspMembersResource(standardUserAcspMembership));
        // When
        const result = await getViewData(request);
        // Then
        expect(result).toMatchObject({
            accountOwnersTableData: [[

                { text: "james.morris@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/JGyB\">Remove <span class=\"govuk-visually-hidden\">james.morris@gmail.com</span></a>"
                }

            ]],
            standardUsersTableData: [[

                { text: "jane.doe@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/WSC838\">Remove <span class=\"govuk-visually-hidden\">jane.doe@gmail.com</span></a>"
                }

            ]],
            administratorsTableData: [[

                { text: "jeremy.lloris@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/ABC123\">Remove <span class=\"govuk-visually-hidden\">jeremy.lloris@gmail.com</span></a>"
                }

            ]],
            addUserUrl: "/authorised-agent/add-user?cf=true",
            backLinkUrl: "/authorised-agent/",
            companyName: "Acme ltd",
            companyNumber: "123456",
            lang: expect.anything(),
            loggedInUserRole: "owner",
            removeUserLinkUrl: "/authorised-agent/remove-member/:id"
        });
    });
    it("should thow an error when acsp details not fetched", async () => {

        const request = mockRequest();
        mockGetTranslationsForView.mockReturnValueOnce({
            remove: "Remove"
        });
        const emptyAcspMembersResource = {
            ...getMockAcspMembersResource(accountOwnerAcspMembership),
            items: []
        };
        mockGetMembershipForLoggedInUser.mockResolvedValue(emptyAcspMembersResource);
        await expect(getViewData(request))
            .rejects.toThrow();
    });
});
