import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { getAcspMembershipForMemberId } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../mocks/acsp.members.mock";

jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetAcspMembershipForMemberIdJestFn = jest.fn();
const request = mockRequest();
const mockMemberId = "abc123";

mockCreateOauthPrivateApiClient.mockReturnValue({
    acspManageUsersService: {
        getAcspMembershipForMemberId: mockGetAcspMembershipForMemberIdJestFn
    }
});

describe("getAcspMembersService", () => {
    describe("getAcspMembershipForMemberId", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return acsp membership when 200 is received", async () => {
            // Given
            const sdkResource: Resource<AcspMembership> = {
                httpStatusCode: StatusCodes.OK,
                resource: accountOwnerAcspMembership
            };
            mockGetAcspMembershipForMemberIdJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getAcspMembershipForMemberId(request, mockMemberId);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should error if no response returned from SDK", async () => {
            mockGetAcspMembershipForMemberIdJestFn.mockResolvedValueOnce(undefined);

            await expect(getAcspMembershipForMemberId(request, mockMemberId))
                .rejects.toThrow();
        });

        it("should throw an HttpError error if status code is 401", async () => {
            mockGetAcspMembershipForMemberIdJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembership>);

            await expect(getAcspMembershipForMemberId(request, mockMemberId))
                .rejects.toThrow(HttpError);
        });

        it("Should error if no response resource returned from SDK", async () => {
            mockGetAcspMembershipForMemberIdJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<AcspMembership>);

            await expect(getAcspMembershipForMemberId(request, mockMemberId))
                .rejects.toThrow();
        });
    });
});
