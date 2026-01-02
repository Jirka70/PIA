import { z } from "zod";

export const getProjectsByUserIdInput = z.object({
    userId: z.string()
});
