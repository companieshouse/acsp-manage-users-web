import { getViewData } from "../../../../src/routers/controllers/manageUsersController";
import { mockRequest } from "../../../mocks/request.mock";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import { mockAcspMembersResource, getMockAcspMembersResource } from "../../../mocks/acsp.members.mock";
import { UserRole, AcspMembership, UserStatus, MembershipStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");
const mockGetAcspMemberships = jest.spyOn(acspMemberService, "getAcspMemberships");
const mockGetMembershipForLoggedInUser = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");

const mockOwner: AcspMembership = {
    etag: "asdf123",
    id: "asdf234",
    userId: "234rfd",
    userEmail: "james.morris@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.OWNER,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: UserStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

const mockAdmin: AcspMembership = {
    etag: "asdf",
    id: "fdsa",
    userId: "lkadsf03",
    userEmail: "jeremy.lloris@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.ADMIN,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: UserStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

const mockStandard: AcspMembership = {
    etag: "234asdf",
    id: "oi3ji4u6ahb",
    userId: "lkadsf03",
    userEmail: "jane.doe@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.STANDARD,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: UserStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

describe("manageUsersController - getViewData", () => {
    it("should return the correct view data object", async () => {

        const request = mockRequest();
        mockGetTranslationsForView.mockReturnValueOnce({
            remove: "Remove"
        });
        mockGetMembershipForLoggedInUser.mockResolvedValue(mockAcspMembersResource);
        mockGetAcspMemberships
            .mockResolvedValueOnce(getMockAcspMembersResource(mockOwner))
            .mockResolvedValueOnce(getMockAcspMembersResource(mockAdmin))
            .mockResolvedValue(getMockAcspMembersResource(mockStandard));
        // When
        const result = await getViewData(request);
        // Then
        expect(result).toMatchObject({
            accountOwnersTableData: [[

                { text: "james.morris@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/asdf234\">Remove <span class=\"govuk-visually-hidden\">james.morris@gmail.com</span></a>"
                }

            ]],
            standardUsersTableData: [[

                { text: "jane.doe@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/oi3ji4u6ahb\">Remove <span class=\"govuk-visually-hidden\">jane.doe@gmail.com</span></a>"
                }

            ]],
            administratorsTableData: [[

                { text: "jeremy.lloris@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a href=\"/authorised-agent/remove-member/fdsa\">Remove <span class=\"govuk-visually-hidden\">jeremy.lloris@gmail.com</span></a>"
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
});
