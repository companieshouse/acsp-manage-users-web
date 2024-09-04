import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export interface Navigation {
    [x: string]: {
        allowedReferers: string[];
        redirectTo: string;
        allowedUserRoles: UserRole[]
    };
}
