import { z } from "zod";

export const getManyAsTranslatorInput = z.object({
    translatorId: z.string()
});
