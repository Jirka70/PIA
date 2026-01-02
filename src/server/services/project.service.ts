import { insertProjectSchema, type InsertProjectSchema } from "@/lib/validators/trpc/project/project-schema";
import * as projectRepo from "@/server/repositories/project.repo"
import { InsertProjectType, ProjectType } from "@/lib/types/project.type";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { DB } from "@/lib/types/db.type";

export async function create(db: DB, input: InsertProjectType) : Promise<ProjectType | BadPayloadType> {
  const parsed = insertProjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
        ok: false as const,
        error: parsed.error
    }
  }

  return projectRepo.createProject(db, input);
}
