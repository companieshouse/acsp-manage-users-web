import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { membershipLookup } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../mocks/acsp.members.mock";
import * as refreshTokenService from "../../../src/services/refreshTokenService";

jest.mock("../../../src/services/apiClientService");
jest.mock("../../../src/services/refreshTokenService");
jest.mock("../../../src/lib/helpers/acspLogger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockMembershipLookupJestFn = jest.fn();
const refreshTokenSpy: jest.SpyInstance = jest.spyOn(refreshTokenService, "refreshToken");
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

        it("should call refreshToken if status code is 401", async () => {
            // Given
            const sdkResource: Resource<AcspMembership> = {
                httpStatusCode: StatusCodes.OK,
                resource: accountOwnerAcspMembership
            };
            mockMembershipLookupJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembership>)
                .mockResolvedValueOnce(sdkResource);
            // When
            await membershipLookup(request, mockAcspNumber, userEmail);
            // Then
            expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
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
