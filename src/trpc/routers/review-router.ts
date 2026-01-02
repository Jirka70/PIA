import { createTRPCRouter, protectedProcedure } from "../init";
import { companyReview, Project, Role, translatorReview } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid"
import { publishTranslatorReviewInput } from "@/lib/validators/trpc/review/publishTranslatorReview";
import { publishCompanyReviewInput } from "@/lib/validators/trpc/review/publishCompanyReview";
import { getTranslatorReviewByProjectIdInput } from "@/lib/validators/trpc/review/getTranslatorReviewByProjectId";
import { getCompanyReviewByProjectIdInput } from "@/lib/validators/trpc/review/getCompanyReviewByProjectId";
import { getTranslatorRatingDistributionInput } from "@/lib/validators/trpc/review/getTranslatorRatingDistribution";



export const reviewRouter = createTRPCRouter({
    publishTranslatorReview: protectedProcedure
        .input(publishTranslatorReviewInput)
        .mutation(async ({ ctx, input }) => {
            const reviewData = input.reviewData;
            const db = ctx.db;

            const user = ctx.user

            const [project] = await db
                .select()
                .from(Project)
                .where(eq(Project.id, input.projectId))
            
            if (user.role !== "admin"
                    && (!project || project.clientId !== user.id)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: `Project is not created by user ${user.name}. Cannot post review for this project`
                })
            }

            if (!project || !project.translatorId) {
                return {
                    error: "Project not found"
                }
            }

            const existingReview = await db
                .select()
                .from(translatorReview)
                .where(eq(translatorReview.projectId, project.id))
                .limit(1)

            if (existingReview.length) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Translator review for this project already exists."
                })
            }

            const [review] = await db
              .insert(translatorReview)
              .values({
                id: nanoid(),
                clientId: user.id,
                translatorId: project.translatorId,
                projectId: project.id,
                qualityRating: reviewData.qualityRating,
                communicationRating: reviewData.communicationRating,
                punctualityRating: reviewData.punctualityRating,
                overallRating: reviewData.overallRating,

                title: reviewData.title,
                comment: reviewData.comment,
              })
              .returning()

            console.log("review", review)

            return {
                translatorReview: review
            }
        }),

    publishCompanyReview: protectedProcedure
        .input(publishCompanyReviewInput)
        .mutation(async ({ ctx, input }) => {
                
            const reviewData = input.reviewData;
            const db = ctx.db;

            const user = ctx.user

            const [project] = await db
                .select()
                .from(Project)
                .where(eq(Project.id, input.projectId))
            
            if (user.role !== "admin"
                    && (!project || project.clientId !== user.id)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: `Project is not created by user ${user.name}. Cannot post review for this project`
                })
            }

            if (!project) {
                return {
                    error: "Project not found"
                }
            }

            if (!project.clientId) {
                return {
                    error: "Project is does not have a client"
                }
            }

            const existingReview = await db
                .select()
                .from(companyReview)
                .where(eq(companyReview.projectId, project.id))
                .limit(1)

            if (existingReview.length) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Company review for this project already exists."
                })
            }

            const [review] = await db
              .insert(companyReview)
              .values({
                id: nanoid(),
                clientId: project.clientId,
                projectId: project.id,
                priceRating: reviewData.priceRating,
                supportRating: reviewData.supportRating,
                wouldRecommend: reviewData.wouldRecommend,
                overallRating: reviewData.overallRating,
              })
              .returning()


            return {
                companyReview: review
            }
        }),
    
    getTranslatorReviewByProjectId: protectedProcedure
        .input(getTranslatorReviewByProjectIdInput)
        .query(async ({ ctx, input }) => {
            const db = ctx.db;
            const user = ctx.user;
            const role = ctx.user.role as Role

            const [project] = await db
                .select()
                .from(Project)
                .where(eq(Project.id, input.id))

            if (role === "user" && (project.clientId !== user.id || !project)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Not authenticated"
                    })
                }

            const [review] = await db
                .select()
                .from(translatorReview)
                .where(eq(translatorReview.projectId, input.id))

            return {
                translatorReview: review
            }
        }),
    getCompanyReviewByProjectId: protectedProcedure
        .input(getCompanyReviewByProjectIdInput)
        .query(async ({ ctx, input }) => {
            const db = ctx.db;
            const user = ctx.user;
            const role = ctx.user.role as Role

            const [project] = await db
                .select()
                .from(Project)
                .where(eq(Project.id, input.id))

            if (role === "user" && (project.clientId !== user.id || !project)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Not authenticated"
                    })
                }

            const review = await db
                .select()
                .from(companyReview)
                .where(eq(companyReview.projectId, input.id))
            
            return {
                companyReview: review
            }
        }),
    getTranslatorRatingDistribution: protectedProcedure
        .input(getTranslatorRatingDistributionInput)
        .query(async ({ ctx, input }) => {
            const db = ctx.db;
            const user = ctx.user;
            const role = user.role as Role;

            if (!["admin", "owner"].includes(role) && user.id !== input.translatorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized to view these stats"
                })
            }

            const reviews = await db
                .select({
                    overall: translatorReview.overallRating,
                    quality: translatorReview.qualityRating,
                    communication: translatorReview.communicationRating,
                    punctuality: translatorReview.punctualityRating,
                })
                .from(translatorReview)
                .where(eq(translatorReview.translatorId, input.translatorId));

            type RatingValue = 1 | 2 | 3 | 4 | 5;
            type RatingBucket = Record<RatingValue, number>;

            const emptyCounts = (): RatingBucket => ({
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            });

            const distribution: Record<"overall" | "quality" | "communication" | "punctuality", RatingBucket> = {
                overall: emptyCounts(),
                quality: emptyCounts(),
                communication: emptyCounts(),
                punctuality: emptyCounts(),
            };

            for (const review of reviews) {
                (["overall", "quality", "communication", "punctuality"] as const).forEach((key) => {
                    const value = review[key];
                    if (value && distribution[key][value as RatingValue] !== undefined) {
                        distribution[key][value as RatingValue] += 1;
                    }
                });
            }

            return { distribution };
        })
})
