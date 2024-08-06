import { z } from "zod";

export function validateIdParam (id: string): boolean {
    const idSchema = z.string().min(1);
    try {
        idSchema.parse(id);
        return true;
    } catch (e) {
        return false;
    }
}
