import z from "zod";
import { translatorSchema } from "@/lib/validators/review-schemas";

export const publishTranslatorReviewInput = z.object({
    projectId: z.string(),
    reviewData: translatorSchema
});
