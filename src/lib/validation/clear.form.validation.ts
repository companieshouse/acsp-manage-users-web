import { z } from "zod";
import { deleteExtraData } from "../utils/sessionUtils";
import { Request } from "express";

export function validateClearForm (clearForm: string): boolean {

    const clearFormSchema = z.literal("true");
    try {
        clearFormSchema.parse(clearForm);
        return true;
    } catch (e) {
        return false;
    }
}

export const clearFormSessionValues = (req: Request, sessionKey: string, referrer: string | undefined, hrefA: string): void => {
    if (referrer?.includes(hrefA) || referrer === undefined) {
        deleteExtraData(req.session, sessionKey);
    }
};
