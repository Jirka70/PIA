import { companyReview, translatorReview } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import {
  CompanyReviewType,
  InsertCompanyReviewType,
  InsertTranslatorReviewType,
  TranslatorReviewType,
} from "@/lib/types/review.type";
import { eq } from "drizzle-orm";

export async function getTranslatorReviewByProjectId(
  db: DB,
  projectId: string,
): Promise<TranslatorReviewType | undefined> {
  const [review] = await db.select().from(translatorReview).where(eq(translatorReview.projectId, projectId));
  return review;
}

export async function getCompanyReviewByProjectId(
  db: DB,
  projectId: string,
): Promise<CompanyReviewType | undefined> {
  const [review] = await db.select().from(companyReview).where(eq(companyReview.projectId, projectId));
  return review;
}

export async function createTranslatorReview(
  db: DB,
  values: InsertTranslatorReviewType,
): Promise<TranslatorReviewType> {
  const [review] = await db.insert(translatorReview).values(values).returning();
  return review;
}

export async function createCompanyReview(db: DB, values: InsertCompanyReviewType): Promise<CompanyReviewType> {
  const [review] = await db.insert(companyReview).values(values).returning();
  return review;
}

export async function getTranslatorRatingDistribution(db: DB, translatorId: string) {
  return db
    .select({
      overall: translatorReview.overallRating,
      quality: translatorReview.qualityRating,
      communication: translatorReview.communicationRating,
      punctuality: translatorReview.punctualityRating,
    })
    .from(translatorReview)
    .where(eq(translatorReview.translatorId, translatorId));
}
