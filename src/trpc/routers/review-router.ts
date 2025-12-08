import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { companyReview, Project, Role, translatorReview } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { companySchema, translatorSchema } from "@/lib/validators/review-schemas";
import { nanoid } from "nanoid"



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

            return {
                translatorReview: review
            }
        }),

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
        })
})
