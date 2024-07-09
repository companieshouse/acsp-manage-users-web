import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export interface NewUserDetails {
    userRole: UserRole;
    userId: string;
    isValid: boolean;
    email: string;
    userName?: string;
}
