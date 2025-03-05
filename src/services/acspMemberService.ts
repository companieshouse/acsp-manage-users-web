import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { AcspMembers, AcspMembership, Errors, UserRole, UpdateOrRemove } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Request } from "express";
import { getExtraData, setExtraData } from "../lib/utils/sessionUtils";
import { TTL_MINUTES } from "../lib/constants";
import { CachedAcspMembershipData } from "../types/membership";
/*
    This service provides access to ACSP members
*/
const stringifyApiErrors = (resource: Resource<AcspMembers | AcspMembership | Errors | undefined>) => {
    return JSON.stringify((resource?.resource as Errors)?.errors || "No error list returned");
};

export function generateCacheKey (page: number, role: UserRole): string {
    return `acspMemberships:page:${page}:role:${role.toString()}`;
}

export const getAcspMemberships = async (req: Request, acspNumber: string, includeRemoved?: boolean, pageIndex?: number, itemsPerPage?: number, role?: UserRole[]): Promise<AcspMembers> => {

    console.log("requesting acsp memberships");
    console.log(`acspNumber:${acspNumber} pageIndex: ${pageIndex} role: ${role} itemsPerPage: ${itemsPerPage}`);

    // add include removed
    // add acspNumber

    let cacheKey;
    if (typeof pageIndex === "number" && !isNaN(pageIndex) && role?.length) {
        cacheKey = generateCacheKey(pageIndex, role[0]);
        const json = getExtraData(req.session, "cachedAcspMembershipData");
        if (json) {
            const cachedAcspMembershipData: CachedAcspMembershipData = JSON.parse(json);
            if (cacheKey in cachedAcspMembershipData) {
                console.log("cache hit, checking if expired");
                if (Date.now() < cachedAcspMembershipData[cacheKey].expiresAt) {
                    const ms = cachedAcspMembershipData[cacheKey].expiresAt - Date.now();
                    const minutes = Math.floor(ms / 1000 / 60);
                    const seconds = Math.floor((ms / 1000) % 60);
                    console.log(`Time left before cache expires ${minutes} min, ${seconds} secs`);
                    return cachedAcspMembershipData[cacheKey].data;
                } else {
                    console.log("cache hit, but was expired");
                    // do we delte cache here?
                }
            }
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
        const errorMessage = `GET /acsps/${acspNumber}/memberships: ${sdkResponse.httpStatusCode}`;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /acsps/${acspNumber}/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    logger.debug(`Received acsp members ${JSON.stringify(sdkResponse)}`);

    if (cacheKey) {
        console.log("gett stored members");

        let cachedAcspMembershipData;
        const json = getExtraData(req.session, "cachedAcspMembershipData");

        if (json) {
            cachedAcspMembershipData = JSON.parse(json) || {};
        } else {
            cachedAcspMembershipData = {};
        }

        cachedAcspMembershipData[cacheKey] = {
            data: sdkResponse.resource,
            expiresAt: Date.now() + TTL_MINUTES * 60 * 1000
        };

        console.log("saving cache", cachedAcspMembershipData);

        try {
            console.log("stringify now");
            const str = JSON.stringify(cachedAcspMembershipData);
            console.log("set extra data");

            setExtraData(req.session, "cachedAcspMembershipData", str);

        } catch (err) {
            console.log("error with json stingify, ", err);
        }
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
    // save this member

    let cachedAcspMembershipData;
    const json = getExtraData(req.session, "cachedAcspMembershipData");

    if (json) {
        cachedAcspMembershipData = JSON.parse(json) || {};
    } else {
        cachedAcspMembershipData = {};
    }

    cachedAcspMembershipData[Date.now().toString()] = {
        data: sdkResponse.resource,
        expiresAt: Date.now() + TTL_MINUTES * 60 * 1000
    };

    console.log("saving cache lookup search", cachedAcspMembershipData);

    try {
        const str = JSON.stringify(cachedAcspMembershipData);
        setExtraData(req.session, "cachedAcspMembershipData", str);

    } catch (err) {
        console.log("error with json stingify, ", err);
    }

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
