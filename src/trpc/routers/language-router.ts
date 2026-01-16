import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import { addLanguageToTranslatorInput } from "@/lib/validators/trpc/language/addLanguageToTranslator";
import { removeLanguageOfTranslatorInput } from "@/lib/validators/trpc/language/removeLanguageOfTranslator";
import * as languageService from "@/server/services/language.service";
import { isBadPayload } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

export const languageRouter = createTRPCRouter({
    addLanguageToTranslator: adminProcedure
        .input(addLanguageToTranslatorInput)
        .mutation(async ({ ctx, input }) => {
            const result = await languageService.addLanguage(ctx.db, {
                translatorId: input.translatorId,
                languageCode: input.code
            });

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid translator language payload",
                    cause: result.error
                })
            }

            return { success: "OK" }
        }),
    removeLanguageOfTranslator: adminProcedure
        .input(removeLanguageOfTranslatorInput)
        .mutation(async ({ ctx, input }) => {
            const result = await languageService.removeLanguage(ctx.db, {
                translatorId: input.translatorId,
                languageCode: input.code
            });

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid translator language payload",
                    cause: result.error
                })
            }

            return { success: "OK" }
        }),
    getLanguages: adminProcedure
        .query(async ({ ctx }) => {
            const languages = await languageService.getLanguages(ctx.db);
            return { languages };
        }),
    getLanguagesPublic: baseProcedure.query(async ({ ctx }) => {
        const languages = await languageService.getLanguages(ctx.db);
        return { languages };
    })
})
