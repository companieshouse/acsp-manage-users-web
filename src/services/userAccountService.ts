import { Request } from "express";
import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
// import * as constants from "../lib/constants";
import createError from "http-errors";
import { User, Errors } from "private-api-sdk-node/dist/services/user-account/types";

const stringifyApiErrors = (resource: Resource<User[] | Errors>) => {
    return JSON.stringify((resource.resource as Errors)?.errors || "No error list returned");
};

// find user based on email
export const getUserDetails = async (req: Request, email: string): Promise<User[] | Errors> => {
    const apiClient = createOauthPrivateApiClient(req);

    logger.info(`GET /user/search email: ${email}`);
    const sdkResponse: Resource<User[] | Errors> = await apiClient.userAccountService.findUser([email]);

    if (!sdkResponse) {
        const errMsg = `No response from GET /user/search, email: ${email}`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `${sdkResponse.httpStatusCode} - GET /user/search - `;
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
