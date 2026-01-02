import { z } from "zod";

export const removeLanguageOfTranslatorInput = z.object({
    translatorId: z.string(),
    code: z.string()
});
