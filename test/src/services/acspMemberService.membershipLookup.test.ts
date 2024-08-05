import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { membershipLookup } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../mocks/acsp.members.mock";

jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockMembershipLookupJestFn = jest.fn();
const request = mockRequest();
const mockAcspNumber = "abc123";
const userEmail = "email@email.com";

mockCreateOauthPrivateApiClient.mockReturnValue({
    acspManageUsersService: {
        membershipLookup: mockMembershipLookupJestFn
    }
});

describe("getAcspMembersService", () => {
    describe("membershipLookup", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return acsp membership when 200 is received", async () => {
            // Given
            const sdkResource: Resource<AcspMembership> = {
                httpStatusCode: StatusCodes.OK,
                resource: accountOwnerAcspMembership
            };
            mockMembershipLookupJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await membershipLookup(request, mockAcspNumber, userEmail);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should error if no response returned from SDK", async () => {
            mockMembershipLookupJestFn.mockResolvedValueOnce(undefined);

            await expect(membershipLookup(request, mockAcspNumber, userEmail))
                .rejects.toThrow();
        });

        it("should throw an HttpError error if status code is 401", async () => {
            mockMembershipLookupJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembership>);

            await expect(membershipLookup(request, mockAcspNumber, userEmail))
                .rejects.toThrow(HttpError);
        });

        it("Should error if no response resource returned from SDK", async () => {
            mockMembershipLookupJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<AcspMembership>);

            await expect(membershipLookup(request, mockAcspNumber, userEmail))
                .rejects.toThrow();
        });
    });
});
