import * as constants from "../constants";
import { USER_ROLE } from "../../types/userRole";

export const validateRole = (role:string|undefined):string|undefined => {
    if (role === USER_ROLE.OWNER || role === USER_ROLE.ADMIN || role === USER_ROLE.STANDARD) {
        return undefined;
    }
    return constants.ERRORS_SELECT_USER_ROLE;
};
