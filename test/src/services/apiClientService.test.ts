import { createPrivateApiClient } from "private-api-sdk-node";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { createOAuthApiClient, createOauthPrivateApiClient, createPrivateApiKeyClient } from "../../../src/services/apiClientService";
import { createApiClient, IHttpClient } from "@companieshouse/api-sdk-node";
import * as sessionUtils from "../../../src/lib/utils/sessionUtils";
import { mockRequest } from "../../mocks/request.mock";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
jest.mock("private-api-sdk-node");
jest.mock("@companieshouse/api-sdk-node");

const getAccessTokenSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getAccessToken");

describe("createPrivateApiKeyClient", () => {
    it("should return private API client", () => {
        // Given
        const privateApiClient: PrivateApiClient = new PrivateApiClient({} as IHttpClient, {} as IHttpClient);
        (createPrivateApiClient as jest.Mock).mockReturnValue(privateApiClient);
        // When
        const result = createPrivateApiKeyClient();
        // Then
        expect(result).toBeInstanceOf(PrivateApiClient);
    });
});

describe("createOauthPrivateApiClient", () => {
    it("should return private API client", () => {
        // Given
        const privateApiClient: PrivateApiClient = new PrivateApiClient({} as IHttpClient, {} as IHttpClient);
        (createPrivateApiClient as jest.Mock).mockReturnValue(privateApiClient);
        getAccessTokenSpy.mockReturnValue("accessToken");
        // When
        const result = createOauthPrivateApiClient(mockRequest() as Request);
        // Then
        expect(result).toBeInstanceOf(PrivateApiClient);
    });
});

describe("createOAuthApiClient", () => {
    it("should return private API client", () => {
        // Given
        const apiClient: ApiClient = new ApiClient({} as IHttpClient, {} as IHttpClient);
        (createApiClient as jest.Mock).mockReturnValue(apiClient);
        // When
        const result = createOAuthApiClient(new Session());
        // Then
        expect(result).toBeInstanceOf(ApiClient);
    });
});
