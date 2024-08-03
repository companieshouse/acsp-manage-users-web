import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export interface Membership {
    id: string;
    userId: string;
    userEmail: string;
    acspNumber: string;
    userRole: UserRole;
    userDisplayName:string;
}
