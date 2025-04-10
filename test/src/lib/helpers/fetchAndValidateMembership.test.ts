
import { fetchAndValidateMembership } from "../../../../src/lib/helpers/fetchAndValidateMembership";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";
import { mockRequest } from "../../../mocks/request.mock";
import { accountOwnerAcspMembership, administratorAcspMembershipWithDisplayName } from "../../../mocks/acsp.members.mock";

jest.mock("../../../../src/services/acspMemberService");
jest.mock("../../../../src/lib/utils/sessionUtils");

describe("fetchAndValidateMembership", () => {

    test.each([
        {
            acspMembership: accountOwnerAcspMembership,
            expectedUserDisplayName: constants.LANG_KEY_FOR_NOT_PROVIDED,
            expectedUserDisplayNameOrEmail: accountOwnerAcspMembership.userEmail,
            returnInfo: "displayNameOrEmail containing their email address"
        },
        {
            acspMembership: administratorAcspMembershipWithDisplayName,
            expectedUserDisplayName: administratorAcspMembershipWithDisplayName.userDisplayName,
            expectedUserDisplayNameOrEmail: administratorAcspMembershipWithDisplayName.userDisplayName,
            returnInfo: "displayNameOrEmail containing their name"
        }
    ])("should return formatted Membership with user display name $expectedUserDisplayName and $returnInfo",
        async ({ acspMembership, expectedUserDisplayName, expectedUserDisplayNameOrEmail }) => {
            // Given
            (acspMemberService.getAcspMembershipForMemberId as jest.Mock).mockResolvedValue(acspMembership);
            (sessionUtils.getLoggedInAcspNumber as jest.Mock).mockReturnValue("123456");
            const request = mockRequest();
            // When
            const result = await fetchAndValidateMembership(request, "JGyB");
            // Then
            expect(result).toEqual({
                id: acspMembership.id,
                userId: acspMembership.userId,
                userEmail: acspMembership.userEmail,
                acspNumber: acspMembership.acspNumber,
                userRole: acspMembership.userRole,
                userDisplayName: expectedUserDisplayName,
                displayNameOrEmail: expectedUserDisplayNameOrEmail
            });
        });

    it("should reject when call to getAcspMembershipForMemberId rejects", async () => {
        (acspMemberService.getAcspMembershipForMemberId as jest.Mock).mockRejectedValue(undefined);
        const request = mockRequest();
        await expect(fetchAndValidateMembership(request, ""))
            .rejects.toEqual(undefined);
    });

    it("should throw an error when ACSP number does not match logged in ACSP number", async () => {
        (acspMemberService.getAcspMembershipForMemberId as jest.Mock).mockResolvedValue(accountOwnerAcspMembership);
        (sessionUtils.getLoggedInAcspNumber as jest.Mock).mockReturnValue("mismatch");
        const request = mockRequest();
        await expect(fetchAndValidateMembership(request, ""))
            .rejects.toThrow("ACSP Number mismatch");
    });
});
