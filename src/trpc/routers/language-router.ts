import { language, translatorLanguage } from "@/db/schema";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import { and, eq } from "drizzle-orm";
import { addLanguageToTranslatorInput } from "@/lib/validators/trpc/language/addLanguageToTranslator";
import { removeLanguageOfTranslatorInput } from "@/lib/validators/trpc/language/removeLanguageOfTranslator";

export const languageRouter = createTRPCRouter({
    addLanguageToTranslator: adminProcedure
        .input(addLanguageToTranslatorInput)
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db;

            await db.insert(translatorLanguage).values({
                translatorId: input.translatorId,
                languageCode: input.code
            })

            return {
                success: "OK"
            }
        }),
    removeLanguageOfTranslator: adminProcedure
        .input(removeLanguageOfTranslatorInput)
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db;

            await db.delete(translatorLanguage)
                .where(
                    and(
                        eq(translatorLanguage.translatorId, input.translatorId),
                        eq(translatorLanguage.languageCode, input.code)
                    )
                )

            return {
                success: "OK"
            }
        }),
    getLanguages: adminProcedure
        .query(async ({ ctx }) => {
            const languages = await ctx.db
                .select()
                .from(language)

            return {
                languages
            }
        }),
    getLanguagesPublic: baseProcedure.query(async ({ ctx }) => {
        const languages = await ctx.db.select().from(language);
        return { languages };
    })
})
