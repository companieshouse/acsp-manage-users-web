import { z } from "zod";

export function validateEmailString (emailString: string): boolean {
    const emailSchema = z.string().email();
    try {
        emailSchema.parse(emailString);
        return true;
    } catch (e) {
        return false;
    }
}
