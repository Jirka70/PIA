import { Project, projectStatus, ProjectAcceptState } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { z } from "zod";

export const PROJECT_NAME_MAX = 100;
export const PROJECT_DESCRIPTION_MAX = 10_000;
export const PROGRESS_MIN = 0;
export const PROGRESS_MAX = 100;
export const PROGRESS_NOTE_MAX = 10_000;
export const LANGUAGE_CODE_MIN = 2;
export const LANGUAGE_CODE_MAX = 10;

export const insertProjectSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(PROJECT_NAME_MAX),
    description: z.string().max(PROJECT_DESCRIPTION_MAX).nullable().optional(),
    status: z.enum(projectStatus.enumValues).optional(),
    progressPercent: z.number().int().min(PROGRESS_MIN).max(PROGRESS_MAX).optional(),
    progressNote: z.string().max(PROGRESS_NOTE_MAX).nullable().optional(),
    sourceLanguage: z.string().min(LANGUAGE_CODE_MIN).max(LANGUAGE_CODE_MAX),
    targetLanguage: z.string().min(LANGUAGE_CODE_MIN).max(LANGUAGE_CODE_MAX),
    translatorId: z.string().min(1).nullable().optional(),
    clientId: z.string().min(1).nullable().optional(),
    acceptState: z.enum(ProjectAcceptState.enumValues).optional(),
    dueAt: z.date().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type InsertProjectSchema = z.infer<typeof insertProjectSchema>;
