// components/reviews/review-schemas.ts
import { z } from "zod"

export const translatorSchema = z.object({
  translatorName: z.string().min(2, "Jméno překladatele musí mít alespoň 2 znaky"),
  languagePair: z.string().optional(),
  qualityRating: z.number().min(0).max(5).optional(),
  communicationRating: z.number().min(0).max(5).optional(),
  punctualityRating: z.number().min(0).max(5).optional(),
  overallRating: z.number().min(1, "Hodnocení je povinné").max(5),
  title: z.string().min(3, "Titulek musí mít alespoň 3 znaky").max(100),
  comment: z.string().min(10, "Komentář musí mít alespoň 10 znaků").max(1000),
})

export const companySchema = z.object({
  companyName: z.string().min(2, "Název firmy musí mít alespoň 2 znaky"),
  priceRating: z.number().min(0).max(5).optional(),
  supportRating: z.number().min(0).max(5).optional(),
  wouldRecommend: z.boolean().optional(),
  overallRating: z.number().min(1, "Hodnocení je povinné").max(5),
  title: z.string().min(3, "Titulek musí mít alespoň 3 znaky").max(100),
  comment: z.string().min(10, "Komentář musí mít alespoň 10 znaků").max(1000),
})

export type TranslatorFormData = z.infer<typeof translatorSchema>
export type CompanyFormData = z.infer<typeof companySchema>

export type ReviewFormData =
  | (TranslatorFormData & { reviewType: "translator" })
  | (CompanyFormData & { reviewType: "company" })
