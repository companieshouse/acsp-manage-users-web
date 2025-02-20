
import { fetchAndValidateMembership } from "../../../../src/lib/helpers/fetchAndValidateMembership";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { mockRequest } from "../../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";

jest.mock("../../../../src/services/acspMemberService");
jest.mock("../../../../src/lib/utils/sessionUtils");

describe("fetchAndValidateMembership", () => {

    it("should return formatted Membership ", async () => {
        (acspMemberService.getAcspMembershipForMemberId as jest.Mock).mockResolvedValue(accountOwnerAcspMembership);
        (sessionUtils.getLoggedInAcspNumber as jest.Mock).mockReturnValue("123456");
        const request = mockRequest();
        const result = await fetchAndValidateMembership(request, "JGyB");
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
