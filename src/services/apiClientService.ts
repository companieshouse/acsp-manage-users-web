import { createPrivateApiClient } from "private-api-sdk-node";
import { ACCOUNT_URL, ACCOUNTS_USER_INTERNAL_API_KEY, INTERNAL_API_URL } from "../lib/constants";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { getAccessToken } from "../lib/utils/sessionUtils";
import { Request } from "express";

export const createPrivateApiKeyClient = (): PrivateApiClient => {
    return createPrivateApiClient(ACCOUNTS_USER_INTERNAL_API_KEY, undefined, ACCOUNT_URL, undefined);
};

export function createOauthPrivateApiClient (req: Request): PrivateApiClient {
    const oauthAccessToken = getAccessToken(req.session);
    return createPrivateApiClient(undefined, oauthAccessToken, INTERNAL_API_URL, undefined);
}
