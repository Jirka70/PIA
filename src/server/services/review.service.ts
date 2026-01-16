import { Role } from "@/db/schema";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { DB } from "@/lib/types/db.type";
import { CompanyReviewType, InsertCompanyReviewType, InsertTranslatorReviewType, TranslatorReviewType } from "@/lib/types/review.type";
import {
  CompanyReviewByProjectIdInput,
  PublishCompanyReviewInput,
  PublishTranslatorReviewInput,
  TranslatorRatingDistributionInput,
  TranslatorReviewByProjectIdInput,
} from "@/lib/types/review-input.type";
import { getCompanyReviewByProjectIdInput } from "@/lib/validators/trpc/review/getCompanyReviewByProjectId";
import { getTranslatorRatingDistributionInput } from "@/lib/validators/trpc/review/getTranslatorRatingDistribution";
import { getTranslatorReviewByProjectIdInput } from "@/lib/validators/trpc/review/getTranslatorReviewByProjectId";
import { publishCompanyReviewInput } from "@/lib/validators/trpc/review/publishCompanyReview";
import { publishTranslatorReviewInput } from "@/lib/validators/trpc/review/publishTranslatorReview";
import * as projectRepo from "@/server/repositories/project.repo";
import * as reviewRepo from "@/server/repositories/review.repo";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export async function publishTranslatorReview(
  db: DB,
  input: PublishTranslatorReviewInput,
  userId: string,
  userRole: Role,
  userName: string
): Promise<{ translatorReview?: TranslatorReviewType, error?: string } | BadPayloadType> {
  const parsed = publishTranslatorReviewInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (userRole !== "admin" && (!project || project.clientId !== userId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Project is not created by user ${userName}. Cannot post review for this project`,
    });
  }

  if (!project || !project.translatorId) {
    return {
      error: "Project not found",
    };
  }

  const existingReview = await reviewRepo.getTranslatorReviewByProjectId(db, project.id);

  if (existingReview) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Translator review for this project already exists.",
    });
  }

  const reviewPayload: InsertTranslatorReviewType = {
    id: nanoid(),
    clientId: userId,
    translatorId: project.translatorId,
    projectId: project.id,
    qualityRating: parsed.data.reviewData.qualityRating,
    communicationRating: parsed.data.reviewData.communicationRating,
    punctualityRating: parsed.data.reviewData.punctualityRating,
    overallRating: parsed.data.reviewData.overallRating,
    title: parsed.data.reviewData.title,
    comment: parsed.data.reviewData.comment,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const translatorReview = await reviewRepo.createTranslatorReview(db, reviewPayload);

  return {
    translatorReview,
  };
}

export async function publishCompanyReview(
  db: DB,
  input: PublishCompanyReviewInput,
  userId: string,
  userRole: Role,
  userName: string
): Promise<{ companyReview?: CompanyReviewType; error?: string } | BadPayloadType> {
  const parsed = publishCompanyReviewInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (userRole !== "admin" && (!project || project.clientId !== userId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Project is not created by user ${userName}. Cannot post review for this project`,
    });
  }

  if (!project) {
    return {
      error: "Project not found",
    };
  }

  if (!project.clientId) {
    return {
      error: "Project is does not have a client",
    };
  }

  const existingReview = await reviewRepo.getCompanyReviewByProjectId(db, project.id);

  if (existingReview) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Company review for this project already exists.",
    });
  }

  const reviewPayload: InsertCompanyReviewType = {
    id: nanoid(),
    clientId: project.clientId,
    projectId: project.id,
    priceRating: parsed.data.reviewData.priceRating,
    supportRating: parsed.data.reviewData.supportRating,
    wouldRecommend: parsed.data.reviewData.wouldRecommend,
    overallRating: parsed.data.reviewData.overallRating,
  };

  const companyReview = await reviewRepo.createCompanyReview(db, reviewPayload);

  return {
    companyReview,
  };
}

export async function getTranslatorReviewByProjectId(db: DB, input: TranslatorReviewByProjectIdInput, userId: string, userRole: Role) {
  const parsed = getTranslatorReviewByProjectIdInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.id);

  if (userRole === "user" && (!project || project.clientId !== userId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  const translatorReview = await reviewRepo.getTranslatorReviewByProjectId(db, parsed.data.id);
  return { translatorReview };
}

export async function getCompanyReviewByProjectId(db: DB, input: CompanyReviewByProjectIdInput, userId: string, userRole: Role) {
  const parsed = getCompanyReviewByProjectIdInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.id);

  if (userRole === "user" && (!project || project.clientId !== userId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  const companyReview = await reviewRepo.getCompanyReviewByProjectId(db, parsed.data.id);

  return { companyReview };
}

export async function getTranslatorRatingDistribution(
  db: DB,
  input: TranslatorRatingDistributionInput,
  userId: string,
  userRole: Role
) {
  const parsed = getTranslatorRatingDistributionInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if (!["admin", "owner"].includes(userRole) && userId !== parsed.data.translatorId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized to view these stats",
    });
  }

  const reviews = await reviewRepo.getTranslatorRatingDistribution(db, parsed.data.translatorId);

  type RatingValue = 1 | 2 | 3 | 4 | 5;
  type RatingBucket = Record<RatingValue, number>;

  const emptyCounts = (): RatingBucket => ({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
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
}
