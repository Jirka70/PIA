import { ProjectFile, ProjectFileType } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import { InsertProjectFileType } from "@/lib/types/project-file.type";

export async function createProjectFile(db: DB, values: InsertProjectFileType) : Promise<ProjectFileType> {
    const [res] = await db
        .insert(ProjectFile)
        .values(values)
        .returning()

    return res;
} 