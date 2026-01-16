import { addLanguageToTranslatorInput } from "@/lib/validators/trpc/language/addLanguageToTranslator";
import { removeLanguageOfTranslatorInput } from "@/lib/validators/trpc/language/removeLanguageOfTranslator";
import * as languageRepo from "@/server/repositories/language.repo";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { DB } from "@/lib/types/db.type";
import { InsertTranslatorLanguageType } from "@/lib/types/translator-language.type";

export async function addLanguage(
  db: DB,
  values: InsertTranslatorLanguageType,
): Promise<InsertTranslatorLanguageType | BadPayloadType> {
  const parsed = addLanguageToTranslatorInput.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  await languageRepo.addLanguageToTranslator(db, values);
  return values;
}

export async function removeLanguage(
  db: DB,
  values: InsertTranslatorLanguageType,
): Promise<InsertTranslatorLanguageType | BadPayloadType> {
  const parsed = removeLanguageOfTranslatorInput.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  await languageRepo.removeLanguageFromTranslator(db, values.translatorId, values.languageCode);
  return values;
}

export async function getLanguages(db: DB) {
  return languageRepo.getLanguages(db);
}

export async function getLanguagesByCodes(db: DB, codes: string[]) {
  return languageRepo.getLanguagesByCodes(db, codes);
}

export async function getTranslatorLanguages(db: DB, translatorId: string) {
  return languageRepo.getTranslatorLanguages(db, translatorId);
}
