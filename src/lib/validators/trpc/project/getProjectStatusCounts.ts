import { z } from "zod";

export const getProjectStatusCountsInput = z.object({
    translatorId: z.string()
});
