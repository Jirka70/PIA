import { z } from "zod";

export const getProjectByIdInput = z.object({
    id: z.string()
});
