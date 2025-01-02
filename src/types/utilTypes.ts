import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { PaginationData } from "./pagination";

export type AnyRecord = Record<string, unknown>;

export interface BaseViewData {
    lang: AnyRecord;
    templateName: string
    errors?: {
        [key: string]: {
            text: string;
        };
    };
    loggedInUserRole?: UserRole,
}

export interface ViewDataWithBackLink extends BaseViewData {
    backLinkUrl: string;
}

export type MemberRawViewData = {
    memberships: AcspMembership[];
    pageNumber: number;
    pagination?: PaginationData;
}

export type PageQueryParams = {
    ownerPage: string;
    adminPage: string;
    standardPage: string;
}

export type PageNumbers = {
    ownerPage: number;
    adminPage: number;
    standardPage: number;
}

export type UserRoleChangeData = {
    acspMembershipId: string;
    userRole: string;
    userEmail: string;
    userDisplayName?: string;
    changeRolePageUrl: string;
}
