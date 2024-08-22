import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export enum UserRoleMatomoFormat {
    OWNER = "account-owner",
    ADMIN = "admin",
    STANDARD = "standard-user"
}

export const convertUserRole = (userRole: UserRole): string => {
    switch (userRole) {
    case UserRole.ADMIN: return UserRoleMatomoFormat.ADMIN;
    case UserRole.OWNER: return UserRoleMatomoFormat.OWNER;
    case UserRole.STANDARD: return UserRoleMatomoFormat.STANDARD;

    default: return "";
    }
};
