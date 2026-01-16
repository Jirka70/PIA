import { translatorLanguage } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type TranslatorLanguageType = InferSelectModel<typeof translatorLanguage>;
export type InsertTranslatorLanguageType = InferInsertModel<typeof translatorLanguage>;
