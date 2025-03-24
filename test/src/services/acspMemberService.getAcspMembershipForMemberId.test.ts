import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { getAcspMembershipForMemberId } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../mocks/acsp.members.mock";
import * as refreshTokenService from "../../../src/services/refreshTokenService";

jest.mock("../../../src/services/apiClientService");
jest.mock("../../../src/services/refreshTokenService");
jest.mock("../../../src/lib/helpers/acspLogger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetAcspMembershipForMemberIdJestFn = jest.fn();
const refreshTokenSpy: jest.SpyInstance = jest.spyOn(refreshTokenService, "refreshToken");
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

        it("should call refreshToken if status code is 401", async () => {
            // Given
            const sdkResource: Resource<AcspMembership> = {
                httpStatusCode: StatusCodes.OK,
                resource: accountOwnerAcspMembership
            };
            mockGetAcspMembershipForMemberIdJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembership>)
                .mockResolvedValueOnce(sdkResource);
            // When
            await getAcspMembershipForMemberId(request, mockMemberId);
            // Then
            expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
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
