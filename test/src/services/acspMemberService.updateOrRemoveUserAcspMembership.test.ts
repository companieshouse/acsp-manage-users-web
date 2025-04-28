import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { updateOrRemoveUserAcspMembership } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";
import * as refreshTokenService from "../../../src/services/refreshTokenService";

jest.mock("../../../src/services/apiClientService");
jest.mock("../../../src/services/refreshTokenService");
jest.mock("../../../src/lib/helpers/acspLogger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockUpdateOrRemoveUseJestFn = jest.fn();
const refreshTokenSpy: jest.SpyInstance = jest.spyOn(refreshTokenService, "refreshToken");
const request = mockRequest();
const mockAcspMemberId = "abc123";

mockCreateOauthPrivateApiClient.mockReturnValue({
    acspManageUsersService: {
        updateOrRemoveUserAcspMembership: mockUpdateOrRemoveUseJestFn
    }
});

describe("getAcspMembersService", () => {
    describe("updateOrRemoveUserAcspMembership", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return an empty resolved promise on successful removal", async () => {
            // Given
            const sdkResource: Resource<undefined> = {
                httpStatusCode: StatusCodes.OK,
                resource: undefined
            };
            mockUpdateOrRemoveUseJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await updateOrRemoveUserAcspMembership(request, mockAcspMemberId, { removeUser: true });
            // Then
            expect(result).toEqual(undefined);
        });

        it("should return an empty resolved promise on successful role change", async () => {
            // Given
            const sdkResource: Resource<undefined> = {
                httpStatusCode: StatusCodes.OK,
                resource: undefined
            };
            mockUpdateOrRemoveUseJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await updateOrRemoveUserAcspMembership(request, mockAcspMemberId, { updateUser: { userRole: UserRole.STANDARD } });
            // Then
            expect(result).toEqual(undefined);
        });

        it("should call refreshToken if status code is 401", async () => {
            // Given
            const sdkResource: Resource<undefined> = {
                httpStatusCode: StatusCodes.OK,
                resource: undefined
            };
            mockUpdateOrRemoveUseJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<undefined>)
                .mockResolvedValueOnce(sdkResource);
            // When
            await updateOrRemoveUserAcspMembership(request, mockAcspMemberId, { updateUser: { userRole: UserRole.STANDARD } });
            // Then
            expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if no sdk response returned", async () => {
            await expect(updateOrRemoveUserAcspMembership(request, mockAcspMemberId, { updateUser: { userRole: UserRole.STANDARD } }))
                .rejects.toThrow(Error);
        });
    });
});
