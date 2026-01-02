import z from "zod";

export const getTranslatorRatingDistributionInput = z.object({
    translatorId: z.string()
});
