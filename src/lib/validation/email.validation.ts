import { z } from "zod";

export function validateEmailString (emailString: string): boolean {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([^.@][^@\s]+)$/;

    const emailSchema = z.string().regex(regex);

    try {
        emailSchema.parse(emailString);
        return true;
    } catch (e) {
        return false;
    }
}
