import { language, translatorLanguage } from "@/db/schema";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import { z } from "zod"
import { and, eq } from "drizzle-orm";

export const languageRouter = createTRPCRouter({
    addLanguageToTranslator: adminProcedure
        .input(z.object({
            translatorId: z.string(),
            code: z.string(),
        }))
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
        .input(z.object({
            translatorId: z.string(),
            code: z.string(),
        }))
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
