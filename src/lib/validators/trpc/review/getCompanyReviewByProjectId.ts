import z from "zod";

export const getCompanyReviewByProjectIdInput = z.object({
    id: z.string()
});
