import { pgTable, text, timestamp, boolean, pgEnum, smallint, primaryKey, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["owner","admin","translator","user"]);
export type Role = typeof userRole.enumValues[number] | "undefined"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: userRole("role").default("user").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const projectStatus = pgEnum("project_status", [
  "NEW",         // založeno, čeká na zpracování
  "IN_PROGRESS", // překládá se
  "QA",          // kontrola (review/LQA)
  "BLOCKED",     // zablokováno (čeká na podklady apod.)
  "DONE",        // hotovo (před odevzdáním)
  "CLOSED",      // uzavřeno/archivováno
]);

export type ProjectStatus = (typeof projectStatus.enumValues)[number];

export const language = pgTable("language", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
});

export const activityStatus = pgEnum("activity_status", [
  "COMPLETED_PROJECT",
  "CREATED_PROJECT",
  "TRANSLATION_SUBMITTED",
  "REVISION_REQUEST",
  "PROJECT_CANCELED",
])

export const activitySeverity = pgEnum("activity_severity", [
  "Warning",
  "Info",
  "Success",
  "Critical"
])

export const userActivity = pgTable("activity", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "set null" }),
  projectId: text("project_id")
    .references(() => Project.id, { onDelete: "set null" }),
  info: text("info")
    .default(""),
  date: timestamp("date")
    .defaultNow()
    .notNull(),
  activityStatus: activityStatus("activity_status")
    .notNull(),
  activitySeverity: activitySeverity("activity_severity")
    .notNull()
})

export const translatorLanguage = pgTable(
  "translator_language",
  {
    translatorId: text("translator_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade"}),
    languageCode: text("language_code")
      .notNull()
      .references(() => language.code, { onDelete: "cascade" })
  },
  (t) => [
    primaryKey({ columns: [t.translatorId, t.languageCode] }),
  ]
);

export const projectFileType = pgEnum("project_file_type", [
  "SOURCE", "TRANSLATE"
])

export const ProjectFile = pgTable("project_file", {
  id: text("id")
    .primaryKey(),
  projectId: text("project_id")
    .references(() => Project.id, { onDelete: "cascade" })
    .notNull(),
  fileType: projectFileType("project_file_type")
    .notNull(),
  fileName: text("file_name")
    .notNull(),
  contentType: text("content_type")
    .notNull(),
  size: integer("size")
    .notNull(),
  storageKey: text("storage_key")
    .notNull(),
  url: text("url")
    .notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull()
})



export const Project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),

  status: projectStatus("status").default("NEW").notNull(),
  progressPercent: smallint("progress_percent").default(0).notNull(),
  progressNote: text("progress_note"),
  sourceLanguage: text("source_language")
    .notNull()
    .references(() => language.code),

  targetLanguage: text("target_language")
    .notNull()
    .references(() => language.code),

  translatorId: text("translator_id")
    .references(() => user.id, {
      onDelete: "set null"
    }),
  clientId: text("client_id")
    .references(() => user.id, {
      onDelete: "set null"
    }),

  dueAt: timestamp("due_at"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  })

export const translatorReview = pgTable("translator_review", {
  id: text("id").primaryKey().notNull(),
  clientId: text("client_id")
    .references(() => user.id, { onDelete: "set null" })
    .notNull(),
  translatorId: text("translator_id")
    .references(() => user.id, { onDelete: "set null"})
    .notNull(),
  projectId: text("project_id")
    .references(() => Project.id, { onDelete: "cascade" })
    .notNull(),
  
  qualityRating: integer("quality_rating"),
  communicationRating: integer("communication_rating"),
  punctualityRating: integer("punctuality_rating"),
  overallRating: integer("overall_rating").notNull(),

  title: text("title").notNull(),
  comment: text("comment").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const companyReview = pgTable("company_review", {
  id: text("id").primaryKey(),
  clientId: text("client_id")
    .references(() => user.id, { onDelete: "set null" })
    .notNull(),
  projectId: text("project_id")
    .references(() => Project.id, { onDelete: "cascade" })
    .notNull(),

  priceRating: integer("price_rating"),
  supportRating: integer("support_rating"),
  wouldRecommend: boolean("would_recommend"),
  overallRating: integer("overall_rating")

})

export const schema = {
  user,
  session,
  account,
  verification,

  userRole,

  projectStatus,
  language,

  activityStatus,
  activitySeverity,
  userActivity,

  translatorLanguage,

  ProjectFile,
  projectFileType,
  Project,

  translatorReview,
  companyReview,
}


export type ProjectType = typeof Project.$inferSelect
export type ProjectStatusType = (typeof projectStatus.enumValues)[number];
export type ProjectFileType = typeof ProjectFile.$inferSelect
export type userActivityType = typeof userActivity.$inferInsert
export type CompanyReviewType = typeof companyReview.$inferSelect
export type TranslatorReviewType = typeof translatorReview.$inferSelect
