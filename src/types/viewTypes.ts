import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export interface TableTextEntry {
    text: string,
    html?: never
}

export interface TableHtmlEntry {
    text?: never,
    html: string
}

export type TableEntry = TableTextEntry | TableHtmlEntry;

export type KnownUserRole = UserRole.ADMIN | UserRole.OWNER | UserRole.STANDARD;
