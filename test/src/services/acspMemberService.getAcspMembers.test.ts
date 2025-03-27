import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { getAcspMemberships } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { AcspMembers } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership, getMockAcspMembersResource } from "../../mocks/acsp.members.mock";
import * as refreshTokenService from "../../../src/services/refreshTokenService";

jest.mock("../../../src/services/apiClientService");
jest.mock("../../../src/services/refreshTokenService");
jest.mock("../../../src/lib/helpers/acspLogger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetAcspMembersJestFn = jest.fn();
const refreshTokenSpy: jest.SpyInstance = jest.spyOn(refreshTokenService, "refreshToken");
const request = mockRequest();

mockCreateOauthPrivateApiClient.mockReturnValue({
    acspManageUsersService: {
        getAcspMemberships: mockGetAcspMembersJestFn
    }
});

const acspNumber = "abc123";

describe("getAcspMembersService", () => {
    describe("getAcspMemberships", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return acsp members", async () => {
            // Given
            const sdkResource: Resource<AcspMembers> = {
                httpStatusCode: StatusCodes.OK,
                resource: getMockAcspMembersResource([accountOwnerAcspMembership])
            };
            mockGetAcspMembersJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getAcspMemberships(request, acspNumber);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockGetAcspMembersJestFn.mockResolvedValueOnce(undefined);

            await expect(getAcspMemberships(request, acspNumber))
                .rejects.toThrow();
        });

        it("should call refreshToken if status code is 401", async () => {
            // Given
            const sdkResource: Resource<AcspMembers> = {
                httpStatusCode: StatusCodes.OK,
                resource: getMockAcspMembersResource([accountOwnerAcspMembership])
            };
            mockGetAcspMembersJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembers>)
                .mockResolvedValueOnce(sdkResource);
            // When
            await getAcspMemberships(request, acspNumber);
            // Then
            expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            mockGetAcspMembersJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<AcspMembers>);

            await expect(getAcspMemberships(request, acspNumber))
                .rejects.toThrow();
        });
    });
});
