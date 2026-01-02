import { z } from "zod";

export const addLanguageToTranslatorInput = z.object({
    translatorId: z.string(),
    code: z.string()
});
