import { z } from "zod";

export const getManyAsUserInput = z.object({
    userId: z.string()
});
