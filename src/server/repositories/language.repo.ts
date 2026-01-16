import { language, translatorLanguage } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import { InsertTranslatorLanguageType, TranslatorLanguageType } from "@/lib/types/translator-language.type";
import { LanguageType } from "@/lib/types/language.type";
import { and, eq, inArray } from "drizzle-orm";

export async function getLanguages(db: DB): Promise<LanguageType[]> {
  return db.select().from(language);
}

export async function getLanguagesByCodes(db: DB, codes: string[]): Promise<LanguageType[]> {
  if (!codes.length) return [];

  return db
    .select()
    .from(language)
    .where(inArray(language.code, codes));
}

export async function addLanguageToTranslator(
  db: DB,
  values: InsertTranslatorLanguageType,
): Promise<TranslatorLanguageType> {
  const [inserted] = await db.insert(translatorLanguage).values(values).returning();
  return inserted;
}

export async function removeLanguageFromTranslator(
  db: DB,
  translatorId: string,
  code: string,
): Promise<number> {
  const result = await db
    .delete(translatorLanguage)
    .where(
      and(eq(translatorLanguage.translatorId, translatorId), eq(translatorLanguage.languageCode, code)),
    );

  return Number(result?.rowCount ?? 0);
}

export async function getTranslatorLanguages(db: DB, translatorId: string) {
  return db
    .select({ code: language.code, name: language.name })
    .from(translatorLanguage)
    .innerJoin(language, eq(language.code, translatorLanguage.languageCode))
    .where(eq(translatorLanguage.translatorId, translatorId));
}
