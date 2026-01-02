import { z } from "zod";

export const getTranslatorAverageRatingsInput = z.object({
    translatorId: z.string()
});
