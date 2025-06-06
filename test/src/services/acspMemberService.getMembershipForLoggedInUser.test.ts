import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { getMembershipForLoggedInUser } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { AcspMembers } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership, getMockAcspMembersResource } from "../../mocks/acsp.members.mock";
import * as refreshTokenService from "../../../src/services/refreshTokenService";

jest.mock("../../../src/services/apiClientService");
jest.mock("../../../src/services/refreshTokenService");
jest.mock("../../../src/lib/helpers/acspLogger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetMembershipForLoggedInUserJestFn = jest.fn();
const refreshTokenSpy: jest.SpyInstance = jest.spyOn(refreshTokenService, "refreshToken");
const request = mockRequest();

mockCreateOauthPrivateApiClient.mockReturnValue({
    acspManageUsersService: {
        getUserAcspMembership: mockGetMembershipForLoggedInUserJestFn
    }
});

describe("getAcspMembersService", () => {
    describe("getMembershipForLoggedInUser", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return acsp membership for logged in user", async () => {
            // Given
            const sdkResource: Resource<AcspMembers> = {
                httpStatusCode: StatusCodes.OK,
                resource: getMockAcspMembersResource([accountOwnerAcspMembership])
            };
            mockGetMembershipForLoggedInUserJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getMembershipForLoggedInUser(request);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockGetMembershipForLoggedInUserJestFn.mockResolvedValueOnce(undefined);

            await expect(getMembershipForLoggedInUser(request))
                .rejects.toThrow();
        });

        it("should call refreshToken if status code is 401", async () => {
            // Given
            const sdkResource: Resource<AcspMembers> = {
                httpStatusCode: StatusCodes.OK,
                resource: getMockAcspMembersResource([accountOwnerAcspMembership])
            };

            mockGetMembershipForLoggedInUserJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembers>)
                .mockResolvedValueOnce(sdkResource);
            // When
            await getMembershipForLoggedInUser(request);
            // Then
            expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            mockGetMembershipForLoggedInUserJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<AcspMembers>);

            await expect(getMembershipForLoggedInUser(request))
                .rejects.toThrow();
        });
    });
});
