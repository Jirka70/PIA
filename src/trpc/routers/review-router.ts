import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { companyReview, Project, Role, translatorReview, userActivity } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { companySchema, translatorSchema } from "@/lib/validators/review-schemas";
import { nanoid } from "nanoid"



// Handles translator/company review creation and retrieval with authorization checks
export const reviewRouter = createTRPCRouter({
    publishTranslatorReview: protectedProcedure
        .input(z.object({
            projectId: z.string(),
            reviewData: translatorSchema
        }))
        .mutation(async ({ ctx, input }) => {
            const reviewData = input.reviewData;
            const db = ctx.db;

            const user = ctx.user

            // Only project owner (or admin) can publish a translator review
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

            await db.insert(userActivity).values({
              id: nanoid(),
              userId: user.id,
              projectId: project.id,
              info: "Customer left a translator review",
              activityStatus: "COMPLETED_PROJECT",
              activitySeverity: "Info"
            })

            console.log("review", review)

            return {
                translatorReview: review
            }
        }),

    // Company review submission (for the client’s own company)
    publishCompanyReview: protectedProcedure
        .input(z.object({
            projectId: z.string(),
            reviewData: companySchema
        }))
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


            await db.insert(userActivity).values({
              id: nanoid(),
              userId: user.id,
              projectId: project.id,
              info: "Customer left a company review",
              activityStatus: "COMPLETED_PROJECT",
              activitySeverity: "Info"
            })


            return {
                companyReview: review
            }
        }),
    
    getTranslatorReviewByProjectId: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
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
        .input(z.object({
            id: z.string()
        }))
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
        .input(z.object({ translatorId: z.string() }))
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
