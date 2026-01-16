import type { InferSelectModel } from "drizzle-orm";
import { Project, translatorReview, companyReview, user, translatorLanguage } from "@/db/schema";

export type ProjectRow = InferSelectModel<typeof Project>;
export type TranslatorReviewRow = InferSelectModel<typeof translatorReview>;
export type CompanyReviewRow = InferSelectModel<typeof companyReview>;
export type UserRow = InferSelectModel<typeof user>
export type TranslatorLanguageRow = InferSelectModel<typeof translatorLanguage>

/**
 * Umožní posílat do testů jen relevantní subset polí (id/clientId/translatorId apod.).
 * Uvnitř si to doplníme do plného ProjectRow.
 */
type ProjectInput = Partial<ProjectRow> & Pick<ProjectRow, "id">;
type UserInput = Partial<UserRow> & Pick<UserRow, "id">
type TranslatorLanguageInput = TranslatorLanguageRow

type FakeDbConfig = {
  project?: ProjectInput | null;
  user?: UserInput | null;
  translatorLanguage?: TranslatorLanguageInput | null;

  translatorReviewExists?: boolean;
  companyReviewExists?: boolean;

  insertedTranslatorReview?: Partial<TranslatorReviewRow>;
  insertedCompanyReview?: Partial<CompanyReviewRow>;
};

function buildTranslatorLanguageRow(input: TranslatorLanguageInput) : TranslatorLanguageRow {
  return input
}

function buildUserRow(input: UserInput) : UserRow {
  const now = new Date();

  return {
    id: input.id,
    name: input.name ?? "username",
    email: input.email ?? "user@example.com",
    emailVerified: input.emailVerified ?? false,
    image: input.image ?? null,
    banned: input.banned ?? false,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    role: input.role ?? "user"
  }
}

function buildProjectRow(input: ProjectInput): ProjectRow {
  // DŮLEŽITÉ: tyhle defaulty jsou jen pro testy.
  // Musí sedět na notNull sloupce z tvého modelu.
  const now = new Date();

  return {
    id: input.id,

    // notNull
    name: input.name ?? "Test project",
    status: input.status ?? "NEW",
    progressPercent: input.progressPercent ?? 0,
    sourceLanguage: input.sourceLanguage ?? "en",
    targetLanguage: input.targetLanguage ?? "cs",
    acceptState: input.acceptState ?? "n/a",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,

    // nullable / optional
    description: input.description ?? null,
    progressNote: input.progressNote ?? null,
    translatorId: input.translatorId ?? null,
    clientId: input.clientId ?? null,
    dueAt: input.dueAt ?? null,
  };
}

export function makeFakeDb(config: FakeDbConfig = {}) {
  const {
    project = undefined,
    translatorReviewExists = false,
    companyReviewExists = false,
    insertedTranslatorReview,
    insertedCompanyReview,
    user = undefined,
    translatorLanguage = undefined
  } = config;


  // Pokud project není null/undefined, doplníme ho do plného ProjectRow
  const projectRow: ProjectRow | undefined =
    project ? buildProjectRow(project) : undefined;

  const userRow: UserRow | undefined = user
    ? buildUserRow(user)
    : undefined


  const translatorLanguageRow : TranslatorLanguageRow | undefined = translatorLanguage
     ? buildTranslatorLanguageRow(translatorLanguage)
     : undefined

  const calls: any[] = []

  return {
    calls,
    select(_projection?: any) {
      calls.push({ op: "select", projection: _projection })
      return {
        from(table: any) {
          calls.push({ op: "from", table })
          return {
            innerJoin(table: any) {
              calls.push({ op: "innerJoin", table })
              return {
                where(_cond: any) {
                  calls.push({ up: "where", cond: _cond })
                  console.log("user?", table === user)
                  console.log("table", table)
                  if (table === Project) {
                    return projectRow ? [projectRow] : [];
                  }

                  // translatorReview existence check
                  if (table === translatorReview) {
                    return {
                      limit: () => (translatorReviewExists ? [{}] : []),
                    };
                  }

                  // companyReview existence check
                  if (table === companyReview) {
                    return {
                      limit: () => (companyReviewExists ? [{}] : []),
                    };
                  }

                  if (table === user) {
                    return userRow 
                      ? [userRow]
                      : []
                  }

                  if (table === translatorLanguage) {
                    return translatorLanguageRow
                      ? [translatorLanguageRow]
                      : []
                  }

                  return [];
                },
              }
            }    
          };
        },
      };
    },

    /**
     * db.insert(...).values(...).returning()
     */
    insert(table: any) {
      return {
        values(_vals: any) {
          return {
            returning() {
              if (table === translatorReview) {
                return [
                  {
                    id: "translator-review-1",
                    ...(insertedTranslatorReview ?? {}),
                  } as TranslatorReviewRow,
                ];
              }

              if (table === companyReview) {
                return [
                  {
                    id: "company-review-1",
                    ...(insertedCompanyReview ?? {}),
                  } as CompanyReviewRow,
                ];
              }

              if (table === project) {
                return [
                  {
                    id: "project-id-1",
                    ...(projectRow ?? {}),
                  } as ProjectRow
                ]
              }

              if (table === user) {
                return [
                  {
                    id: "user-id-1",
                    ...(userRow ?? {}),
                  } as UserRow
                ]
              }

              if (table === translatorLanguage) {
                return [
                  {
                    ...translatorLanguageRow 
                  }
                ]
              }

              return [{}];
            },
          };
        },
      };
    },
  };
}
