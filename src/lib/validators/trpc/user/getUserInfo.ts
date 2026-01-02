import { z } from "zod";

export const getUserInfoInput = z.object({
    id: z.string()
});
