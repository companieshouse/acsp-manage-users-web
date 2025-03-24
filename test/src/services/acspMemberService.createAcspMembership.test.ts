import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { createAcspMembership } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembership } from "../../mocks/acsp.members.mock";
import * as refreshTokenService from "../../../src/services/refreshTokenService";

jest.mock("../../../src/services/apiClientService");
jest.mock("../../../src/services/refreshTokenService");
jest.mock("../../../src/lib/helpers/acspLogger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockCreateAcspMemberJestFn = jest.fn();
const refreshTokenSpy: jest.SpyInstance = jest.spyOn(refreshTokenService, "refreshToken");
const request = mockRequest();
const mockAcspNumber = "abc123";
const userId = "123abc456xyz";
const userRole = UserRole.ADMIN;

mockCreateOauthPrivateApiClient.mockReturnValue({
    acspManageUsersService: {
        createAcspMembership: mockCreateAcspMemberJestFn
    }
});

describe("getAcspMembersService", () => {
    describe("createAcspMembership", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return the newly created acsp membership when 201 created is received", async () => {
            // Given
            const sdkResource: Resource<AcspMembership> = {
                httpStatusCode: StatusCodes.CREATED,
                resource: accountOwnerAcspMembership
            };
            mockCreateAcspMemberJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await createAcspMembership(request, mockAcspNumber, userId, userRole);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockCreateAcspMemberJestFn.mockResolvedValueOnce(undefined);

            await expect(createAcspMembership(request, mockAcspNumber, userId, userRole))
                .rejects.toThrow();
        });

        it("should call refreshToken if status code is 401", async () => {
            // Given
            const sdkResource: Resource<AcspMembership> = {
                httpStatusCode: StatusCodes.CREATED,
                resource: accountOwnerAcspMembership
            };
            mockCreateAcspMemberJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembership>)
                .mockResolvedValueOnce(sdkResource);
            // When
            await createAcspMembership(request, mockAcspNumber, userId, userRole);
            // Then
            expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            mockCreateAcspMemberJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.CREATED
            } as Resource<AcspMembership>);

            await expect(createAcspMembership(request, mockAcspNumber, userId, userRole))
                .rejects.toThrow();
        });
    });
});
