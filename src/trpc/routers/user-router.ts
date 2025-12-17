import z from "zod";
import { adminProcedure, createTRPCRouter } from "../init";
import { language, Project, translatorLanguage, user } from "@/db/schema";
import { eq, getTableColumns, or, sql } from "drizzle-orm";
import { id } from "date-fns/locale";

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
            const [translator] = await ctx.db
                .select()
                .from(user)
                .where(eq(user.id, input.id))

            if (!translator) return null;

            const projects = await ctx.db
                .select()
                .from(Project)
                .where(eq(Project.translatorId, input.id))

            const languages = await ctx.db
                .select({ code: language.code, name: language.name })
                .from(translatorLanguage)
                .innerJoin(language, eq(language.code, translatorLanguage.languageCode))
                .where(eq(translatorLanguage.translatorId, input.id));

            return { translator, projects, languages };
        }),
    getUserInfo: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;
            const rows = await db
                .select({
                    user,
                    project: Project,
                })
                .from(user)
                .leftJoin(Project, eq(Project.clientId, user.id))

                .where(eq(user.id, input.id));

            if (rows.length === 0) return null;

            const obtainedUser = rows[0].user

            return {
                user: obtainedUser,
                projects: rows.map((item) => item.project).filter((item) => !!item)
            }
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
