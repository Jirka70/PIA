import { z } from "zod";

export const updateProgressInput = z.object({
    projectId: z.string(),
    newProgress: z
        .number()
        .min(0, { message: "Progress must be higher or equal than 0" })
        .max(100, { message: "Progress must be lower or equal than 100" })
});
