import { pgTable, text, timestamp, boolean, pgEnum, smallint, primaryKey, integer, customType, AnyPgColumn } from "drizzle-orm/pg-core";
import { User } from "lucide-react";

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

export const ProjectFile = pgTable("project_file", {
  id: text("id")
    .primaryKey(),
  projectId: text("project_id")
    .references(() => Project.id, { onDelete: "cascade" })
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
    .notNull(),
  targetLanguage: text("target_language")
    .notNull(),
  translatorId: text("translator_id")
    .references(() => user.id, {
      onDelete: "set null"
    }),
  sourceFileId: text("source_file_id")
    .references((): AnyPgColumn => ProjectFile.id, { onDelete: "cascade" }),
  translatedFileId: text("translated_file_id")
    .references((): AnyPgColumn => ProjectFile.id, { onDelete: "cascade" }),
  clientId: text("client_id")
    .references(() => user.id, {
      onDelete: "set null"
    }),

  dueAt: timestamp("due_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  })

export const schema = {
    user, session, account, verification, userRole, projectStatus, language, ProjectFile, Project
}

export type ProjectType = typeof Project.$inferSelect
export type ProjectStatusType = typeof projectStatus
export type ProjectFileType = typeof ProjectFile.$inferSelect
