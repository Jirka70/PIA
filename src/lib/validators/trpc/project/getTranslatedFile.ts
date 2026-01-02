import { z } from "zod";

export const getTranslatedFileInput = z.object({
    projectId: z.string()
});
