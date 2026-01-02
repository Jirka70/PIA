import { z } from "zod";

export const getUserByIdInput = z.object({
    id: z.string()
});
