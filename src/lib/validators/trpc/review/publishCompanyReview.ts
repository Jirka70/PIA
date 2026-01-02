import z from "zod";
import { companySchema } from "@/lib/validators/review-schemas";

export const publishCompanyReviewInput = z.object({
    projectId: z.string(),
    reviewData: companySchema
});
