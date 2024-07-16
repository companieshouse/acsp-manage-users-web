import * as constants from "../constants";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const validateRole = (role: string | undefined): string | undefined => {
    if (
        role === UserRole.OWNER ||
        role === UserRole.ADMIN ||
        role === UserRole.STANDARD
    ) {
        return undefined;
    }
    return constants.ERRORS_SELECT_USER_ROLE;
};
