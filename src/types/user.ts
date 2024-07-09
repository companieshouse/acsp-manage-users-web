import { UserRole } from "./userRole";

export interface NewUserDetails {
    userRole: UserRole;
    userId: string;
    isValid: boolean;
    email: string;
    userName?: string;
}
