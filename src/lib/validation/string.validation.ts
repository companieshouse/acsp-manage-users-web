import { z } from "zod";
import * as constants from "../constants";

export function validateIdParam (id: string): boolean {
    const idSchema = z.string().min(1);
    try {
        idSchema.parse(id);
        return true;
    } catch {
        return false;
    }
}

export function validateActiveTabId (id: string): boolean {
    const idSchema = z.enum([
        constants.ACCOUNT_OWNERS_TAB_ID,
        constants.ADMINISTRATORS_TAB_ID,
        constants.STANDARD_USERS_TAB_ID
    ]);
    try {
        idSchema.parse(id);
        return true;
    } catch {
        return false;
    }
}
