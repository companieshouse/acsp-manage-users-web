import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { createAcspMembership } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import { acspMembership } from "../../mocks/acsp.members.mock";

jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockCreateAcspMemberJestFn = jest.fn();
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
                resource: acspMembership
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

        it("should throw an error if status code is 401", async () => {
            mockCreateAcspMemberJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<AcspMembership>);

            await expect(createAcspMembership(request, mockAcspNumber, userId, userRole))
                .rejects.toThrow(HttpError);
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
