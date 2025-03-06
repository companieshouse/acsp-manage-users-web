import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { AcspMembers, AcspMembership, Errors, UserRole, UpdateOrRemove } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Request } from "express";
import { getExtraData, setExtraData } from "../lib/utils/sessionUtils";
import { TTL_MINUTES, CACHED_ACSP_MEMBERSHIP_DATA } from "../lib/constants";
import { Session } from "@companieshouse/node-session-handler";

/*
    This service provides access to ACSP members
*/
const stringifyApiErrors = (resource: Resource<AcspMembers | AcspMembership | Errors | undefined>) => {
    return JSON.stringify((resource?.resource as Errors)?.errors || "No error list returned");
};

export function saveAcspMembersToSession (cacheKey: string, session: Session | undefined, data: AcspMembers): void {

    const cachedJsonData = getExtraData(session, CACHED_ACSP_MEMBERSHIP_DATA);
    const cachedAcspMembershipData = cachedJsonData ? JSON.parse(cachedJsonData) || {} : {};

    cachedAcspMembershipData[cacheKey] = {
        data,
        expiresAt: Date.now() + TTL_MINUTES * 60 * 1000
    };

    const dataToSave = JSON.stringify(cachedAcspMembershipData);
    setExtraData(session, CACHED_ACSP_MEMBERSHIP_DATA, dataToSave);

}

function getAcspMembersFromSession (req: Request, cacheKey: string): AcspMembers | undefined {
    const cachedJsonData = getExtraData(req.session, CACHED_ACSP_MEMBERSHIP_DATA);

    if (!cachedJsonData) {
        return undefined;
    }

    let cachedAcspMembershipData;
    try {
        cachedAcspMembershipData = JSON.parse(cachedJsonData);
    } catch (error) {
        logger.error("Error parsing JSON: " + JSON.stringify(error));
        return undefined;
    }

    if (cacheKey in cachedAcspMembershipData && Date.now() < cachedAcspMembershipData[cacheKey].expiresAt) {
        console.log("cache hit: ", cacheKey);
        return cachedAcspMembershipData[cacheKey].data;
    }

    return undefined;
}

export const getAcspMemberships = async (req: Request, acspNumber: string, includeRemoved?: boolean, pageIndex?: number, itemsPerPage?: number, role?: UserRole[]): Promise<AcspMembers> => {

    let cacheKey: string | undefined;
    if (typeof pageIndex === "number" && !isNaN(pageIndex) && role?.length && includeRemoved !== undefined) {
        cacheKey = `acspNumber${acspNumber}:page:${pageIndex}:role:${role[0].toString()}:removed:${includeRemoved}`;
        const acspMembers: AcspMembers | undefined = getAcspMembersFromSession(req, cacheKey);
        if (acspMembers) {
            return acspMembers;
        }
    }

    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<AcspMembers | Errors> = await apiClient.acspManageUsersService.getAcspMemberships(acspNumber, includeRemoved, pageIndex, itemsPerPage, role);

    if (!sdkResponse) {
        const errMsg = `GET /acsps/${acspNumber}/memberships - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /acsps/${acspNumber}/memberships: ${sdkResponse.httpStatusCode} cache key ${cacheKey}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /acsps/${acspNumber}/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Received acsp members ${JSON.stringify(sdkResponse)}`);
    if (cacheKey) {
        saveAcspMembersToSession(cacheKey, req.session, sdkResponse.resource as AcspMembers);
    }
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

export const membershipLookup = async (req: Request, acspNumber: string, email: string): Promise<AcspMembers> => {
    const apiClient = createOauthPrivateApiClient(req);

    const sdkResponse: Resource<AcspMembers | Errors> = await apiClient.acspManageUsersService.membershipLookup(acspNumber, email);

    if (!sdkResponse) {
        const errMsg = `POST /acsps/${acspNumber}/memberships/lookup - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `POST /acsps/${acspNumber}/memberships/lookup- ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `POST /acsps/${acspNumber}/memberships/lookup: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Fetched membership for email${email} ${JSON.stringify(sdkResponse)}`);

    saveAcspMembersToSession(Date.now().toString(), req.session, sdkResponse.resource as AcspMembers);

    return Promise.resolve(sdkResponse.resource as AcspMembers);
};

export const getAcspMembershipForMemberId = async (req: Request, acspMembershipId: string): Promise<AcspMembership> => {
    const apiClient = createOauthPrivateApiClient(req);

    const sdkResponse: Resource<AcspMembership | Errors> = await apiClient.acspManageUsersService.getAcspMembershipForMemberId(acspMembershipId);

    if (!sdkResponse) {
        const errMsg = `GET /acsps/memberships/${acspMembershipId} - no response received`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /acsps/memberships/${acspMembershipId} - ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /acsps/memberships/${acspMembershipId} - returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Fetched membership for id ${acspMembershipId} ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as AcspMembership);
};
