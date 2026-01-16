import { ProjectFile, ProjectFileType } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import { InsertProjectFileType } from "@/lib/types/project-file.type";
import { and, eq } from "drizzle-orm";

export async function createProjectFile(db: DB, values: InsertProjectFileType) : Promise<ProjectFileType> {
    const [res] = await db
        .insert(ProjectFile)
        .values(values)
        .returning()

    return res;
} 

export async function getProjectFileByType(
    db: DB,
    projectId: string,
    fileType: ProjectFileType["fileType"],
): Promise<ProjectFileType | undefined> {
    const [projectFile] = await db
        .select()
        .from(ProjectFile)
        .where(and(eq(ProjectFile.projectId, projectId), eq(ProjectFile.fileType, fileType)));

    return projectFile;
}

export async function deleteProjectFileByType(db: DB, projectId: string, fileType: ProjectFileType["fileType"]) {
    return db.delete(ProjectFile).where(and(eq(ProjectFile.projectId, projectId), eq(ProjectFile.fileType, fileType)));
}
