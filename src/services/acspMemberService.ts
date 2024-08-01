import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { AcspMembers, AcspMembership, Errors, UserRole, UpdateOrRemove } from "@companieshouse/private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Request } from "express";
/*
    This service provides access to ACSP members
*/
const stringifyApiErrors = (resource: Resource<AcspMembers | AcspMembership | Errors | undefined>) => {
    return JSON.stringify((resource?.resource as Errors)?.errors || "No error list returned");
};

export const getAcspMemberships = async (req: Request, acspNumber: string): Promise<AcspMembers> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<AcspMembers | Errors> = await apiClient.acspManageUsersService.getAcspMemberships(acspNumber);

    if (!sdkResponse) {
        const errMsg = `GET /acsps/${acspNumber}/memberships - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /acsps/${acspNumber}/memberships: ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /acsps/${acspNumber}/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Received acsp members ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as AcspMembers);
};

export const getMembershipForLoggedInUser = async (req: Request): Promise<AcspMembers> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<AcspMembers | Errors> = await apiClient.acspManageUsersService.getUserAcspMembership();

    if (!sdkResponse) {
        const errMsg = `GET /user/acsps/memberships for logged in user - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /user/acsps/memberships for logged in user - ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /user/acsps/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Received acsp membership for logged in user ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as AcspMembers);
};

export const createAcspMembership = async (req: Request, acspNumber: string, userId: string, userRole: UserRole): Promise<AcspMembership> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<AcspMembership | Errors> = await apiClient.acspManageUsersService.createAcspMembership(acspNumber, userId, userRole);

    if (!sdkResponse) {
        const errMsg = `POST /acsps/${acspNumber}/memberships - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `POST /acsps/${acspNumber}/memberships- ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `POST /acsps/${acspNumber}/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Created acsp membership ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as AcspMembership);
};

export const updateOrRemoveUserAcspMembership = async (req: Request, acspMembershipId: string, updateOrRemove: UpdateOrRemove): Promise<void> => {
    const apiClient = createOauthPrivateApiClient(req);

    const sdkResponse: Resource<undefined | Errors> = await apiClient.acspManageUsersService.updateOrRemoveUserAcspMembership(acspMembershipId, updateOrRemove);

    if (!sdkResponse) {
        const errMsg = `PATCH /acsps/memberships/${acspMembershipId} - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `PATCH /acsps/memberships/${acspMembershipId} - ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    } else {
        logger.debug(`Successfull patch - updated ACSP member ${acspMembershipId}`);
        return Promise.resolve();
    }
};
