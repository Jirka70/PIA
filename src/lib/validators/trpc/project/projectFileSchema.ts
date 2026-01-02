import { ProjectFile, projectFileType } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { z } from "zod";

export const PROJECT_FILE_NAME_MIN = 1;
export const PROJECT_FILE_CONTENT_TYPE_MIN = 1;
export const PROJECT_FILE_STORAGE_KEY_MIN = 1;

export const insertProjectFileSchema = z.object({
    id: z.string().min(1),
    projectId: z.string().min(1),
    fileType: z.enum(projectFileType.enumValues),
    fileName: z.string().min(PROJECT_FILE_NAME_MIN),
    contentType: z.string().min(PROJECT_FILE_CONTENT_TYPE_MIN),
    size: z.number().int().nonnegative(),
    storageKey: z.string().min(PROJECT_FILE_STORAGE_KEY_MIN),
    url: z.url(),
    createdAt: z.date().optional(),
});

export type InsertProjectFileSchema = z.infer<typeof insertProjectFileSchema>;