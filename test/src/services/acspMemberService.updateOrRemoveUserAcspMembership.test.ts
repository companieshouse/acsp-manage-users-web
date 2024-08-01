import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { updateOrRemoveUserAcspMembership } from "../../../src/services/acspMemberService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { UserRole } from "@companieshouse/private-api-sdk-node/dist/services/acsp-manage-users/types";
import { mockRequest } from "../../mocks/request.mock";

jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockUpdateOrRemoveUseJestFn = jest.fn();
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
            const result = await updateOrRemoveUserAcspMembership(request, mockAcspMemberId, { userRole: UserRole.STANDARD });
            // Then
            expect(result).toEqual(undefined);
        });

        it("should throw an error if status code is 401", async () => {
            mockUpdateOrRemoveUseJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<undefined>);

            await expect(updateOrRemoveUserAcspMembership(request, mockAcspMemberId, { userRole: UserRole.STANDARD }))
                .rejects.toThrow(HttpError);
        });
    });
});
