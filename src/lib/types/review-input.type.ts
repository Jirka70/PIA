import { z } from "zod";
import { getCompanyReviewByProjectIdInput } from "@/lib/validators/trpc/review/getCompanyReviewByProjectId";
import { getTranslatorRatingDistributionInput } from "@/lib/validators/trpc/review/getTranslatorRatingDistribution";
import { getTranslatorReviewByProjectIdInput } from "@/lib/validators/trpc/review/getTranslatorReviewByProjectId";
import { publishCompanyReviewInput } from "@/lib/validators/trpc/review/publishCompanyReview";
import { publishTranslatorReviewInput } from "@/lib/validators/trpc/review/publishTranslatorReview";

export type PublishTranslatorReviewInput = z.infer<typeof publishTranslatorReviewInput>;
export type PublishCompanyReviewInput = z.infer<typeof publishCompanyReviewInput>;
export type TranslatorReviewByProjectIdInput = z.infer<typeof getTranslatorReviewByProjectIdInput>;
export type CompanyReviewByProjectIdInput = z.infer<typeof getCompanyReviewByProjectIdInput>;
export type TranslatorRatingDistributionInput = z.infer<typeof getTranslatorRatingDistributionInput>;
