import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { getAcspMemberships } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { AcspMembers } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { accountOwnerAcspMembers } from "../../mocks/acsp.members.mock";

jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetAcspMembersJestFn = jest.fn();
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
                resource: accountOwnerAcspMembers
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

        it("should throw an error if status code is 401", async () => {
            mockGetAcspMembersJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembers>);

            await expect(getAcspMemberships(request, acspNumber))
                .rejects.toThrow(HttpError);
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
