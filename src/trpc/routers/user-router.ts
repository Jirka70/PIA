import z from "zod";
import { adminProcedure, createTRPCRouter } from "../init";
import { language, Project, translatorLanguage, user } from "@/db/schema";
import { eq, getTableColumns, or, sql } from "drizzle-orm";

export const userRouter = createTRPCRouter({
    getUserById: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;

            const [res] = await db
                .select()
                .from(user)
                .where(eq(user.id, input.id))

            return {
                user: res
            }
        }),
    getMany: adminProcedure
        .query(async ({ ctx }) => {
            const db = ctx.db;

            const res = await db
                .select({
                    ...getTableColumns(user),
                    numberOfOpenProjects: sql<number>`
                        count(*) FILTER (
                            WHERE ${Project.status} IN ('NEW', 'IN_PROGRESS', 'QA')
                        )
                    `,
                })
                .from(user)
                .leftJoin(
                    Project,
                    or(eq(Project.clientId, user.id), eq(Project.translatorId, user.id))
                )
                .groupBy(user.id);

            return {
                users: res
            }
        }),
    getTranslatorInfo: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const rows = await ctx.db
                .select({
                    translator: user,
                    project: Project,
                    translatorLang: translatorLanguage,
                    lang: language,
                })
                .from(user)
                .leftJoin(Project, eq(Project.translatorId, user.id))
                .leftJoin(
                    translatorLanguage,
                    eq(translatorLanguage.translatorId, user.id)
                )
                .leftJoin(
                    language,
                    eq(language.code, translatorLanguage.languageCode)
                )
                .where(eq(user.id, input.id));

            if (rows.length === 0) return null;

            const translator = rows[0].translator;

            const projectsMap = new Map<string, typeof Project.$inferSelect>();
            const languagesMap = new Map<string, typeof language.$inferSelect>();

            for (const row of rows) {
                if (row.project && row.project.id && !projectsMap.has(row.project.id)) {
                projectsMap.set(row.project.id, row.project);
                }

                if (row.lang && row.lang.code && !languagesMap.has(row.lang.code)) {
                languagesMap.set(row.lang.code, row.lang);
                }
            }

            return {
                translator,
                projects: Array.from(projectsMap.values()),
                languages: Array.from(languagesMap.values()),
            };
        }),
    getUserStats: adminProcedure
        .query(async ({ ctx }) => {
            const db = ctx.db;
            const [result] = await db
                .select({
                    totalUsers: sql<number>`COUNT(*)`,
                    usersLastMonth: sql<number>`
                    COUNT(*) FILTER (
                        WHERE ${user.createdAt} >= NOW() - INTERVAL '1 month'
                    )
                    `,
                    translators: sql<number>`
                    COUNT(*) FILTER (
                        WHERE ${user.role} = 'translator'
                    )
                    `,
                    normalUsers: sql<number>`
                    COUNT(*) FILTER (
                        WHERE ${user.role} = 'user'
                    )
                    `,
                })
                .from(user);
            
            return {
                result
            }
        })
})
