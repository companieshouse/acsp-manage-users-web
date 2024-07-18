import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

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
    loggedInUserRole?: UserRole
};
