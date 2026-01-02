import z from "zod";

export const getTranslatorReviewByProjectIdInput = z.object({
    id: z.string()
});
