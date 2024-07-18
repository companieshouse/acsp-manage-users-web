import { createPrivateApiKeyClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { User, Errors } from "private-api-sdk-node/dist/services/user-account/types";

const stringifyApiErrors = (resource: Resource<User[] | Errors>) => {
    return JSON.stringify((resource.resource as Errors)?.errors || "No error list returned");
};

// find user based on email
export const getUserDetails = async (email: string): Promise<User[]> => {
    const apiClient = createPrivateApiKeyClient();

    logger.info(`GET /user/search email: ${email}`);
    const sdkResponse: Resource<User[] | Errors> = await apiClient.userAccountService.findUser([email]);

    if (!sdkResponse) {
        const errMsg = `GET /user/search - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode === StatusCodes.NO_CONTENT) {
        logger.debug(`GET /user/search: Successful Request - 204 No content`);
        return Promise.resolve([]);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /user/search: ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        logger.error(`GET /user/search returned a response but no resource`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received user details ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as User[]);
};
