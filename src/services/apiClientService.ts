import { createPrivateApiClient } from "private-api-sdk-node";
import { ACCOUNT_URL, CHS_INTERNAL_API_KEY } from "../lib/constants";
import PrivateApiClient from "private-api-sdk-node/dist/client";

export const createPrivateApiKeyClient = (): PrivateApiClient => {
    return createPrivateApiClient(CHS_INTERNAL_API_KEY, undefined, ACCOUNT_URL, undefined);
};
