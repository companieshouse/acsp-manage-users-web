import { createPrivateApiClient } from "private-api-sdk-node";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { createPrivateApiKeyClient } from "../../../src/services/apiClientService";
import { IHttpClient } from "@companieshouse/api-sdk-node";
jest.mock("private-api-sdk-node");

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
