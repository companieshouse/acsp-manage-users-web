import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { PaginationData } from "./pagination";

export type AnyRecord = Record<string, unknown>;

export type ViewData = {
    lang: AnyRecord;
    errors?: {
        [key: string]: {
            text: string;
        };
    };
    companyName?: string;
    backLinkUrl?: string;
    email?: string;
    userRole?: string;
    loggedInUserRole?: UserRole,
    templateName: string,
    verifyPeopleIdentityFromDate?: string,
    fileAsAuthorisedAgentFromDate?: string
};

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
