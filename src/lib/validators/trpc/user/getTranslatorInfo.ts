import { z } from "zod";

export const getTranslatorInfoInput = z.object({
    id: z.string()
});
