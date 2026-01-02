import { ProjectFile } from "@/db/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type ProjectFileType = InferSelectModel<typeof ProjectFile>
export type InsertProjectFileType = InferInsertModel<typeof ProjectFile>