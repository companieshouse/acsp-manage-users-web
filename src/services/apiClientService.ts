import { createPrivateApiClient } from "private-api-sdk-node";
import { ACCOUNT_LOCAL_URL, ACCOUNTS_API_URL, ACCOUNTS_USER_INTERNAL_API_KEY, INTERNAL_API_URL } from "../lib/constants";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { getAccessToken } from "../lib/utils/sessionUtils";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { createApiClient } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";

export const createPrivateApiKeyClient = (): PrivateApiClient => {
    return createPrivateApiClient(ACCOUNTS_USER_INTERNAL_API_KEY, undefined, undefined, ACCOUNTS_API_URL);
};

export function createOauthPrivateApiClient (req: Request): PrivateApiClient {
    const oauthAccessToken = getAccessToken(req.session);
    return createPrivateApiClient(undefined, oauthAccessToken, INTERNAL_API_URL, undefined);
}

export const createOAuthApiClient = (session: Session | undefined, baseAccountUrl: string = ACCOUNT_LOCAL_URL): ApiClient => {
    return createApiClient(undefined, getAccessToken(session), undefined, baseAccountUrl);
};
