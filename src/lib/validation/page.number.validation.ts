import { z } from "zod";

export function validatePageNumber (pageNum: number, maxNumOfPages: number): boolean {
    const pageNoSchema = z.number().min(1).max(maxNumOfPages);

    try {
        pageNoSchema.parse(pageNum);
        return true;
    } catch {
        return false;
    }
}
