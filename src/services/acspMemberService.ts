import { Resource } from "@companieshouse/api-sdk-node";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { AcspMembers, AcspMembership, Errors, UserRole, UpdateOrRemove } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Request } from "express";
import { acspLogger } from "../lib/helpers/acspLogger";
import { makeApiCallWithRetry } from "./apiCallRetryService";
import { Session } from "@companieshouse/node-session-handler";

/*
    This service provides access to ACSP members
*/
const stringifyApiErrors = (resource: Resource<AcspMembers | AcspMembership | Errors | undefined>) => {
    return JSON.stringify((resource?.resource as Errors)?.errors || "No error list returned");
};

export const getAcspMemberships = async (req: Request, acspNumber: string, includeRemoved?: boolean, pageIndex?: number, itemsPerPage?: number, role?: UserRole[]): Promise<AcspMembers> => {
    const sdkResponse = await makeApiCallWithRetry(
        "acspManageUsersService",
        "getAcspMemberships",
        req,
        req.session as Session,
        acspNumber,
        includeRemoved,
        pageIndex,
        itemsPerPage,
        role
    ) as Resource<AcspMembers | Errors>;

    if (!sdkResponse) {
        const errMsg = `GET /acsps/${acspNumber}/memberships - no response received`;
        acspLogger(req.session, getAcspMemberships.name, errMsg, true);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /acsps/${acspNumber}/memberships: ${sdkResponse.httpStatusCode}`;
        acspLogger(req.session, getAcspMemberships.name, errorMessage + stringifyApiErrors(sdkResponse), true);
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /acsps/${acspNumber}/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    acspLogger(req.session, getAcspMemberships.name, `GET /acsps/${acspNumber}/memberships: Successfully retrieved acsp members, status code ${sdkResponse.httpStatusCode}`);

    return Promise.resolve(sdkResponse.resource as AcspMembers);
};

export const getMembershipForLoggedInUser = async (req: Request): Promise<AcspMembers> => {
    const sdkResponse = await makeApiCallWithRetry(
        "acspManageUsersService",
        "getUserAcspMembership",
        req,
        req.session as Session
    ) as Resource<AcspMembers | Errors>;

    if (!sdkResponse) {
        const errMsg = `GET /user/acsps/memberships for logged in user - no response received`;
        acspLogger(req.session, getMembershipForLoggedInUser.name, errMsg, true);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /user/acsps/memberships for logged in user - ${sdkResponse.httpStatusCode}`;
        acspLogger(req.session, getMembershipForLoggedInUser.name, errorMessage + stringifyApiErrors(sdkResponse), true);
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /user/acsps/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    acspLogger(req.session, getMembershipForLoggedInUser.name, `GET /user/acsps/memberships for logged in user: Successfully received acsp membership for logged in user`);

    return Promise.resolve(sdkResponse.resource as AcspMembers);
};

export const createAcspMembership = async (req: Request, acspNumber: string, userId: string, userRole: UserRole): Promise<AcspMembership> => {
    const sdkResponse = await makeApiCallWithRetry(
        "acspManageUsersService",
        "createAcspMembership",
        req,
        req.session as Session,
        acspNumber,
        userRole,
        userId
    ) as Resource<AcspMembership | Errors>;

    if (!sdkResponse) {
        const errMsg = `POST /acsps/${acspNumber}/memberships - no response received`;
        acspLogger(req.session, createAcspMembership.name, errMsg, true);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `POST /acsps/${acspNumber}/memberships- ${sdkResponse.httpStatusCode}`;
        acspLogger(req.session, createAcspMembership.name, errorMessage + stringifyApiErrors(sdkResponse), true);
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `POST /acsps/${acspNumber}/memberships: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    acspLogger(req.session, createAcspMembership.name, `POST /acsps/${acspNumber}/memberships: Successfully created acsp membership `);

    return Promise.resolve(sdkResponse.resource as AcspMembership);
};

export const updateOrRemoveUserAcspMembership = async (req: Request, acspMembershipId: string, updateOrRemove: UpdateOrRemove): Promise<void> => {
    const sdkResponse = await makeApiCallWithRetry(
        "acspManageUsersService",
        "updateOrRemoveUserAcspMembership",
        req,
        req.session as Session,
        acspMembershipId,
        updateOrRemove
    ) as Resource<undefined | Errors>;
    console.log(sdkResponse);
    console.log("resource");
    console.log(sdkResponse.resource);
    if (!sdkResponse) {
        const errMsg = `PATCH /acsps/memberships/${acspMembershipId} - no response received`;
        acspLogger(req.session, updateOrRemoveUserAcspMembership.name, errMsg, true);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `PATCH /acsps/memberships/${acspMembershipId} - ${sdkResponse.httpStatusCode}`;
        acspLogger(req.session, updateOrRemoveUserAcspMembership.name, errorMessage + stringifyApiErrors(sdkResponse), true);
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    } else {
        acspLogger(req.session, updateOrRemoveUserAcspMembership.name, `PATCH /acsps/memberships/id: Successfull patch - updated ACSP member ${acspMembershipId}`);
        return Promise.resolve();
    }
};

export const membershipLookup = async (req: Request, acspNumber: string, email: string): Promise<AcspMembers> => {
    const sdkResponse = await makeApiCallWithRetry(
        "acspManageUsersService",
        "membershipLookup",
        req,
        req.session as Session,
        acspNumber,
        email
    ) as Resource<AcspMembers | Errors>;

    if (!sdkResponse) {
        const errMsg = `POST /acsps/${acspNumber}/memberships/lookup - no response received`;
        acspLogger(req.session, membershipLookup.name, errMsg, true);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `POST /acsps/${acspNumber}/memberships/lookup- ${sdkResponse.httpStatusCode}`;
        acspLogger(req.session, membershipLookup.name, errorMessage + stringifyApiErrors(sdkResponse), true);
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `POST /acsps/${acspNumber}/memberships/lookup: returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    acspLogger(req.session, membershipLookup.name, `POST /acsps/${acspNumber}/memberships/lookup: Successfully fetched membership based on user email`);

    return Promise.resolve(sdkResponse.resource as AcspMembers);
};

export const getAcspMembershipForMemberId = async (req: Request, acspMembershipId: string): Promise<AcspMembership> => {
    const sdkResponse = await makeApiCallWithRetry(
        "acspManageUsersService",
        "getAcspMembershipForMemberId",
        req,
        req.session as Session,
        acspMembershipId
    ) as Resource<AcspMembership | Errors>;

    if (!sdkResponse) {
        const errMsg = `GET /acsps/memberships/${acspMembershipId} - no response received`;
        acspLogger(req.session, getAcspMembershipForMemberId.name, errMsg, true);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /acsps/memberships/${acspMembershipId} - ${sdkResponse.httpStatusCode}`;
        acspLogger(req.session, getAcspMembershipForMemberId.name, errorMessage + stringifyApiErrors(sdkResponse), true);
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errorMsg = `GET /acsps/memberships/${acspMembershipId} - returned a response but no resource`;
        return Promise.reject(new Error(errorMsg));
    }

    acspLogger(req.session, getAcspMembershipForMemberId.name, `GET /acsps/memberships/${acspMembershipId}: Successfully fetched membership for id ${acspMembershipId}`);

    return Promise.resolve(sdkResponse.resource as AcspMembership);
};
