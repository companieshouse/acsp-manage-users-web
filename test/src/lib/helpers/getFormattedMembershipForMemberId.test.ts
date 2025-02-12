
import { getFormattedMembershipForMemberId } from "../../../../src/lib/helpers/getFormattedMembershipForMemberId";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import { mockRequest } from "../../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";

jest.mock("../../../../src/services/acspMemberService");

describe("getFormattedMembershipForMemberId", () => {

    it("should return formatted Membership ", async () => {
        (acspMemberService.getAcspMembershipForMemberId as jest.Mock).mockResolvedValue(accountOwnerAcspMembership);
        const request = mockRequest();
        const result = await getFormattedMembershipForMemberId(request, "JGyB");
        expect(result).toEqual({
            id: accountOwnerAcspMembership.id,
            userId: accountOwnerAcspMembership.userId,
            userEmail: accountOwnerAcspMembership.userEmail,
            acspNumber: accountOwnerAcspMembership.acspNumber,
            userRole: accountOwnerAcspMembership.userRole,
            userDisplayName: "Not Provided",
            displayNameOrEmail: "james.morris@gmail.com"
        });
    });

    it("should reject when call to getAcspMembershipForMemberId rejects", async () => {
        (acspMemberService.getAcspMembershipForMemberId as jest.Mock).mockRejectedValue(undefined);
        const request = mockRequest();
        await expect(getFormattedMembershipForMemberId(request, ""))
            .rejects.toEqual(undefined);
    });
});
