import { Project, ProjectAcceptState, ProjectFile, companyReview, translatorReview, user } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import { InsertProjectType, ProjectType } from "@/lib/types/project.type";
import { ProjectStatusType } from "@/db/schema";
import { and, eq, inArray, sql, gte, not } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

type ProjectAcceptStateType = (typeof ProjectAcceptState.enumValues)[number];

export async function createProject(db: DB, values: InsertProjectType): Promise<ProjectType> {
    const [res] = await db
        .insert(Project)
        .values(values)
        .returning();

    return res;
}

export async function findProjectById(db: DB, projectId: string): Promise<ProjectType | undefined> {
    const [project] = await db.select().from(Project).where(eq(Project.id, projectId));
    return project;
}

export async function updateProjectAcceptState(db: DB, projectId: string, acceptState: ProjectAcceptStateType): Promise<ProjectType[]> {
    return db
        .update(Project)
        .set({ acceptState })
        .where(eq(Project.id, projectId))
        .returning();
}

export async function updateProjectStatus(db: DB, projectId: string, status: ProjectStatusType) {
    return db.update(Project).set({ status }).where(eq(Project.id, projectId));
}

export async function updateProjectProgress(db: DB, projectId: string, progress: number) {
    return db.update(Project).set({ progressPercent: progress }).where(eq(Project.id, projectId)).returning();
}

export async function updateProjectStatusToQA(db: DB, projectId: string) {
    return db.update(Project).set({ status: "QA" }).where(eq(Project.id, projectId));
}

export async function updateProjectAcceptStateToWaitingForApproval(db: DB, projectId: string) {
    return db
        .update(Project)
        .set({ acceptState: "waiting for approval" })
        .where(eq(Project.id, projectId));
}

export async function updateProjectProgressToHundred(db: DB, projectId: string) {
    return db.update(Project).set({ progressPercent: 100 }).where(eq(Project.id, projectId));
}

export async function listProjectsWithDetailsByClientId(db: DB, clientId: string) {
    const sourceFile = alias(ProjectFile, "source_file");
    const targetFile = alias(ProjectFile, "target_file");
    const translator = alias(user, "translator");

    return db
        .select({
            project: Project,
            sourceFile: sourceFile,
            targetFile: targetFile,
            companyReview: companyReview,
            translatorReview: translatorReview,
            translator: translator,
        })
        .from(Project)
        .leftJoin(sourceFile, and(eq(sourceFile.projectId, Project.id), eq(sourceFile.fileType, "SOURCE")))
        .leftJoin(targetFile, and(eq(targetFile.projectId, Project.id), eq(targetFile.fileType, "TRANSLATE")))
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .leftJoin(translator, eq(translator.id, Project.translatorId))
        .where(eq(Project.clientId, clientId));
}

export async function listProjectsWithDetailsByTranslatorId(db: DB, translatorId: string) {
    const sourceFile = alias(ProjectFile, "source_file");
    const targetFile = alias(ProjectFile, "target_file");
    const client = alias(user, "client");

    return db
        .select({
            project: Project,
            sourceFile,
            targetFile,
            companyReview,
            translatorReview,
            client,
        })
        .from(Project)
        .leftJoin(sourceFile, and(eq(sourceFile.projectId, Project.id), eq(sourceFile.fileType, "SOURCE")))
        .leftJoin(targetFile, and(eq(targetFile.projectId, Project.id), eq(targetFile.fileType, "TRANSLATE")))
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .leftJoin(client, eq(client.id, Project.clientId))
        .where(eq(Project.translatorId, translatorId));
}

export async function findProjectWithRelationsById(db: DB, projectId: string) {
    const client = alias(user, "client");
    const translator = alias(user, "translator");
    const sourceFile = alias(ProjectFile, "source_file");
    const translatedFile = alias(ProjectFile, "translated_file");

    const [project] = await db
        .select({
            project: Project,
            client,
            translator,
            sourceFile,
            translatedFile,
            translatorReview,
            companyReview,
        })
        .from(Project)
        .leftJoin(client, eq(Project.clientId, client.id))
        .leftJoin(translator, eq(Project.translatorId, translator.id))
        .leftJoin(sourceFile, and(eq(sourceFile.projectId, Project.id), eq(sourceFile.fileType, "SOURCE")))
        .leftJoin(translatedFile, and(eq(translatedFile.projectId, Project.id), eq(translatedFile.fileType, "TRANSLATE")))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .where(eq(Project.id, projectId));

    return project;
}

export async function listProjectsWithReviewsByTranslatorId(db: DB, translatorId: string) {
    const client = alias(user, "client");
    const translator = alias(user, "translator");
    const sourceFile = alias(ProjectFile, "source_file");
    const targetFile = alias(ProjectFile, "target_file");

    return db
        .select({
            project: Project,
            client,
            translator,
            sourceFile,
            targetFile,
            companyReview,
            translatorReview,
        })
        .from(Project)
        .leftJoin(client, eq(Project.clientId, client.id))
        .leftJoin(translator, eq(Project.translatorId, translator.id))
        .leftJoin(sourceFile, and(eq(sourceFile.projectId, Project.id), eq(sourceFile.fileType, "SOURCE")))
        .leftJoin(targetFile, and(eq(targetFile.projectId, Project.id), eq(targetFile.fileType, "TRANSLATE")))
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .where(eq(Project.translatorId, translatorId))
        .orderBy(Project.createdAt);
}

export async function listProjectsWithReviewsByClientId(db: DB, clientId: string) {
    const client = alias(user, "client");
    const translator = alias(user, "translator");
    const sourceFile = alias(ProjectFile, "source_file");
    const targetFile = alias(ProjectFile, "target_file");

    return db
        .select({
            project: Project,
            client,
            translator,
            sourceFile,
            targetFile,
            companyReview,
            translatorReview,
        })
        .from(Project)
        .leftJoin(client, eq(Project.clientId, client.id))
        .leftJoin(translator, eq(Project.translatorId, translator.id))
        .leftJoin(sourceFile, and(eq(sourceFile.projectId, Project.id), eq(sourceFile.fileType, "SOURCE")))
        .leftJoin(targetFile, and(eq(targetFile.projectId, Project.id), eq(targetFile.fileType, "TRANSLATE")))
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .where(eq(Project.clientId, clientId));
}

export async function listClientProjectsCreatedSince(db: DB, clientId: string, since: Date) {
    return db
        .select()
        .from(Project)
        .where(and(gte(Project.createdAt, since), eq(Project.clientId, clientId)));
}

export async function getProjectStatsExcludingStatusesSince(db: DB, excludedStatuses: ProjectStatusType[], since: Date) {
    const [stats] = await db
        .select({
            total: sql<number>`count(*)`,
            lastMonth: sql<number>`sum(case when ${Project.createdAt} >= ${since} then 1 else 0 end)`,
        })
        .from(Project)
        .where(not(inArray(Project.status, excludedStatuses)));

    return stats ?? { total: 0, lastMonth: 0 };
}

export async function countProjectsByStatuses(db: DB, statuses: ProjectStatusType[]) {
    const [result] = await db
        .select({
            count: sql<number>`count(*)`,
        })
        .from(Project)
        .where(inArray(Project.status, statuses));

    return result?.count ?? 0;
}

export async function countProjectsWithRecentCreated(db: DB) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [result] = await db
        .select({
            total: sql<number>`count(*)`,
            lastMonth: sql<number>`sum(case when ${Project.createdAt} >= ${oneMonthAgo} then 1 else 0 end)`,
        })
        .from(Project);

    return {
        total: result?.total ?? 0,
        lastMonth: result?.lastMonth ?? 0,
    };
}

export async function countProjectsByStatusesForTranslator(db: DB, translatorId: string, statuses: ProjectStatusType[]) {
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(Project)
        .where(and(eq(Project.translatorId, translatorId), inArray(Project.status, statuses)));

    return result?.count ?? 0;
}
