import { createTRPCRouter, protectedProcedure } from "../init";
import { publishTranslatorReviewInput } from "@/lib/validators/trpc/review/publishTranslatorReview";
import { publishCompanyReviewInput } from "@/lib/validators/trpc/review/publishCompanyReview";
import { getTranslatorReviewByProjectIdInput } from "@/lib/validators/trpc/review/getTranslatorReviewByProjectId";
import { getCompanyReviewByProjectIdInput } from "@/lib/validators/trpc/review/getCompanyReviewByProjectId";
import { getTranslatorRatingDistributionInput } from "@/lib/validators/trpc/review/getTranslatorRatingDistribution";
import * as reviewService from "@/server/services/review.service";
import { isBadPayload } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { Role } from "@/db/schema";

export const reviewRouter = createTRPCRouter({
    publishTranslatorReview: protectedProcedure
        .input(publishTranslatorReviewInput)
        .mutation(async ({ ctx, input }) => {
            const user = ctx.user!
            const result = await reviewService.publishTranslatorReview(ctx.db, input, user.id, user.role as Role, user.name);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid translator review payload",
                    cause: result.error
                })
            }

            return result;
        }),

    publishCompanyReview: protectedProcedure
        .input(publishCompanyReviewInput)
        .mutation(async ({ ctx, input }) => {
            const user = ctx.user!
            const result = await reviewService.publishCompanyReview(ctx.db, input, user.id, user.role as Role, user.name);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid company review payload",
                    cause: result.error
                })
            }

            return result;
        }),
    
    getTranslatorReviewByProjectId: protectedProcedure
        .input(getTranslatorReviewByProjectIdInput)
        .query(async ({ ctx, input }) => {
            const user = ctx.user!
            const result = await reviewService.getTranslatorReviewByProjectId(ctx.db, input, user.id, user.role as Role);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        }),
    getCompanyReviewByProjectId: protectedProcedure
        .input(getCompanyReviewByProjectIdInput)
        .query(async ({ ctx, input }) => {
            const user = ctx.user!
            const result = await reviewService.getCompanyReviewByProjectId(ctx.db, input, user.id, user.role as Role);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        }),
    getTranslatorRatingDistribution: protectedProcedure
        .input(getTranslatorRatingDistributionInput)
        .query(async ({ ctx, input }) => {
            const user = ctx.user!
            const result = await reviewService.getTranslatorRatingDistribution(ctx.db, input, user.id, user.role as Role);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        })
})
