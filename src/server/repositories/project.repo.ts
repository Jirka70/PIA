import { Project } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import { InsertProjectType, ProjectType } from "@/lib/types/project.type";

export async function createProject(db: DB, values: InsertProjectType): Promise<ProjectType> {
    const [res] = await db
        .insert(Project)
        .values(values)
        .returning();

    return res;
}
