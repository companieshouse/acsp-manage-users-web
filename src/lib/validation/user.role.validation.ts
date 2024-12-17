import * as constants from "../constants";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const validateRole = (role: string | undefined): string | undefined => {
    return isValidRole(role) ? undefined : constants.ERRORS_SELECT_USER_ROLE;
};

export const isValidRole = (role: string | undefined): boolean => role === UserRole.OWNER ||
    role === UserRole.ADMIN ||
    role === UserRole.STANDARD;
