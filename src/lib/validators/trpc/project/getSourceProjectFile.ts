import { z } from "zod";

export const getSourceProjectFileInput = z.object({
    projectId: z.string()
});
