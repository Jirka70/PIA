import { adminProcedure, createTRPCRouter, translatorProcedure } from "../init";
import { language, Project, Role, translatorLanguage, translatorReview, user } from "@/db/schema";
import { eq, getTableColumns, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getUserByIdInput } from "@/lib/validators/trpc/user/getUserById";
import { getTranslatorInfoInput } from "@/lib/validators/trpc/user/getTranslatorInfo";
import { getUserInfoInput } from "@/lib/validators/trpc/user/getUserInfo";
import { changeUserRoleInput } from "@/lib/validators/trpc/user/changeUserRole";
import { getTranslatorAverageRatingsInput } from "@/lib/validators/trpc/user/getTranslatorAverageRatings";

export const userRouter = createTRPCRouter({
    getUserById: adminProcedure
        .input(getUserByIdInput)
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
                            WHERE ${Project.status} IN ('NEW', 'IN_PROGRESS', 'QA', 'ASSIGNED')
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
        .input(getTranslatorInfoInput)
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
        .input(getUserInfoInput)
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
    }),
    changeUserRole: adminProcedure
        .input(changeUserRoleInput)
        .mutation(async ({ ctx, input }) => {
            if (input.role === "admin") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Cannot change role to admin"
                })
            }

            const [updatedUser] = await ctx.db
                .update(user)
                .set({ role: input.role })
                .where(eq(user.id, input.id))
                .returning()

            return { 
                user: updatedUser
             }
    }),
    getTranslatorAverageRatings: translatorProcedure
        .input(getTranslatorAverageRatingsInput)
        .query(async ({ ctx, input }) => {
            const db = ctx.db;
            const requesterRole = ctx.user.role as Role;

            if (!["admin", "owner"].includes(requesterRole) && ctx.user.id !== input.translatorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized to access translator ratings"
                })
            }

            const [averages] = await db
                .select({
                    quality: sql<number>`COALESCE(AVG(${translatorReview.qualityRating}), 0)`,
                    communication: sql<number>`COALESCE(AVG(${translatorReview.communicationRating}), 0)`,
                    punctuality: sql<number>`COALESCE(AVG(${translatorReview.punctualityRating}), 0)`,
                    overall: sql<number>`COALESCE(AVG(${translatorReview.overallRating}), 0)`,
                    totalReviews: sql<number>`COUNT(*)`
                })
                .from(translatorReview)
                .where(eq(translatorReview.translatorId, input.translatorId));

            return { averages };
        })
})
