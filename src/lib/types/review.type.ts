import { companyReview, translatorReview } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type TranslatorReviewType = InferSelectModel<typeof translatorReview>;
export type InsertTranslatorReviewType = InferInsertModel<typeof translatorReview>;

export type CompanyReviewType = InferSelectModel<typeof companyReview>;
export type InsertCompanyReviewType = InferInsertModel<typeof companyReview>;
