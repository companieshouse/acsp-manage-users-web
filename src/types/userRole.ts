export const USER_ROLE = {
    OWNER: "owner",
    ADMIN: "admin",
    STANDARD: "standard"
} as const;

type ObjectValues<T> = T[keyof T];

export type UserRole = ObjectValues<typeof USER_ROLE>

export interface AddUser {
    userRole: UserRole;
    userId: string;
    isValid: boolean;
    email: string;
}
