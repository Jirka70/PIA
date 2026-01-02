import { Project } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type ProjectType = InferSelectModel<typeof Project>
export type InsertProjectType = InferInsertModel<typeof Project>