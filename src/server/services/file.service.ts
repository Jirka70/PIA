import { ProjectFileType } from "@/db/schema";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { DB } from "@/lib/types/db.type";
import { InsertProjectFileType } from "@/lib/types/project-file.type";
import { insertProjectFileSchema } from "@/lib/validators/trpc/project/projectFileSchema";
import * as fileRepo from "@/server/repositories/file.repo"

export async function create(db: DB, values: InsertProjectFileType) : Promise<ProjectFileType | BadPayloadType> {
    const parsed = insertProjectFileSchema.safeParse(values);
    
    if (!parsed.success) {
        return {
            ok: false as const,
            error: parsed.error
        }
    }

    return fileRepo.createProjectFile(db, values);
}