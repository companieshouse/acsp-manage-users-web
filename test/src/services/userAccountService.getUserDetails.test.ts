import { Resource } from "@companieshouse/api-sdk-node";
import { createPrivateApiKeyClient } from "../../../src/services/apiClientService";
import { getUserDetails } from "../../../src/services/userAccountService";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "http-errors";
import { User } from "private-api-sdk-node/dist/services/user-account/types";

jest.mock("../../../src/services/apiClientService");

const mockCreatePrivateApiKeyClient = createPrivateApiKeyClient as jest.Mock;
const mockUsersJestFn = jest.fn();

mockCreatePrivateApiKeyClient.mockReturnValue({
    userAccountService: {
        findUser: mockUsersJestFn
    }
});

const mockUsers: User[] = [
    {
        forename: "Jane",
        surname: "Doe",
        email: "jane.doe@email-address.co.uk",
        userId: "abc123",
        displayName: undefined,
        roles: ["restricted-word"],
        hasLinkedOneLogin: false,
        isPrivateBetaUser: false
    }
];

describe("userAccountService", () => {
    describe("getUserDetails", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return user details", async () => {
            // Given
            const sdkResource: Resource<User[]> = {
                httpStatusCode: StatusCodes.OK,
                resource: mockUsers
            };
            mockUsersJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getUserDetails("jane.doe@email-address.co.uk");
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an empty array when no user is found", async () => {
            // Given
            const sdkResource: Resource<User[]> = {
                httpStatusCode: StatusCodes.NO_CONTENT,
                resource: undefined
            };
            mockUsersJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getUserDetails("jane.doe@email-address.co.uk");
            // Then
            expect(result).toEqual([]);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockUsersJestFn.mockResolvedValueOnce(undefined);

            await expect(getUserDetails("email"))
                .rejects.toThrow();
        });

        it("should throw an error if status code is 401", async () => {
            mockUsersJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<User[]>);

            await expect(getUserDetails("email"))
                .rejects.toThrow(HttpError);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            mockUsersJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<User[]>);

            await expect(getUserDetails("email"))
                .rejects.toThrow();
        });
    });
});
