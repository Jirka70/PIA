import { language, translatorLanguage } from "@/db/schema";
import { adminProcedure, baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod"
import { and, count, eq } from "drizzle-orm";

// Language management: add/remove translator languages and expose availability for selection UIs
export const languageRouter = createTRPCRouter({
    addLanguageToTranslator: adminProcedure
        .input(z.object({
            translatorId: z.string(),
            code: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db;

            // Attach a language to a translator (admin only)
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

            // Remove a language assignment from a translator (admin only)
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
            // Admin-only list of all configured languages
            const languages = await ctx.db
                .select()
                .from(language)

            return {
                languages
            }
    }),
    getLanguagesPublic: baseProcedure.query(async ({ ctx }) => {
        // Publicly available language list (no auth)
        const languages = await ctx.db.select().from(language);
        return { languages };
    }),
    getLanguageAvailability: protectedProcedure.query(async ({ ctx }) => {
        // Map language code -> whether at least one translator knows it (used to disable choices in UI)
        const rows = await ctx.db
            .select({
                code: language.code,
                translatorCount: count(translatorLanguage.translatorId)
            })
            .from(language)
            .leftJoin(translatorLanguage, eq(language.code, translatorLanguage.languageCode))
            .groupBy(language.code)

        const availability = rows.reduce<Record<string, boolean>>((acc, row) => {
            acc[row.code] = Number(row.translatorCount) > 0
            return acc
        }, {})

        return { availability }
    })
})
