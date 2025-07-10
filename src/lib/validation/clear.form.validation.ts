import { z } from "zod";

export function validateClearForm (clearForm: string): boolean {

    const clearFormSchema = z.literal("true");
    try {
        clearFormSchema.parse(clearForm);
        return true;
    } catch (e) {
        return false;
    }
}
