import { companyReview, Project, ProjectAcceptState, ProjectFile, projectStatus, Role, translatorLanguage, translatorReview, user, userActivity, ProjectStatusType } from "@/db/schema";
import { adminProcedure, createTRPCRouter, protectedProcedure, translatorProcedure } from "../init";
import { eq, and, sql, inArray, gte, not } from "drizzle-orm"
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createProjectInput } from "@/lib/validators/create-project-schema";
import z from "zod";
import { uploadedFileMeta } from "@/lib/validators/uploaded-file-meta";
import { alias } from "drizzle-orm/pg-core";
import type { db } from "@/db/drizzle"
import { isActive, isCancelled, isCompleted } from "@/lib/project-status-utils";

type DB = typeof db


// Helper query: fetch projects by client id with joined relations
const getProjectsByUserId = async (db: DB, id: string) => {
    const sourceFile = alias(ProjectFile, "source_file");
    const targetFile = alias(ProjectFile, "target_file");
    const translator = alias(user, "translator")

    const projects = await db
        .select({
            project: Project,
            sourceFile,
            targetFile,
            companyReview,
            translatorReview,
            translator
        })
        .from(Project)
        .leftJoin(
            sourceFile,
            and(
                eq(sourceFile.projectId, Project.id),
                eq(sourceFile.fileType, "SOURCE")
            )
        )
        .leftJoin(
            targetFile,
            and(
                eq(targetFile.projectId, Project.id),
                eq(targetFile.fileType, "TRANSLATE")
            )
        )
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .leftJoin(translator, eq(translator.id, Project.translatorId))
        .where(eq(Project.clientId, id))

    console.log("projects: ", projects)

    return {
        projects
    }
}

// Helper query: fetch a single project row
const getProjectById = async (db: DB, id: string) => {
    const [project] = await db
        .select()
        .from(Project)
        .where(eq(Project.id, id))

    return project;
}

// Helper query: fetch projects by translator id with client and files joined
const getProjectsByTranslatorId = async (db: DB, id: string) => {
    const sourceFile = alias(ProjectFile, "source_file");
    const targetFile = alias(ProjectFile, "target_file");
    const clientUser = alias(user, "client_user");

    const projects = await db
        .select({
            project: Project,
            sourceFile,
            targetFile,
            companyReview,
            translatorReview,
            client: clientUser
        })
        .from(Project)
        .leftJoin(
            sourceFile,
            and(
                eq(sourceFile.projectId, Project.id),
                eq(sourceFile.fileType, "SOURCE")
            )
        )
        .leftJoin(
            targetFile,
            and(
                eq(targetFile.projectId, Project.id),
                eq(targetFile.fileType, "TRANSLATE")
            )
        )
        .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
        .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
        .leftJoin(clientUser, eq(clientUser.id, Project.clientId))
        .where(eq(Project.translatorId, id))

    return {
        projects
    }
}


// TRPC router for project lifecycle: creation, status updates, file handling, stats
export const projectRouter = createTRPCRouter({
    create: protectedProcedure
        .input(createProjectInput)
        .mutation(async ({ ctx, input }) => {
            const [suitableTranslator] = await ctx.db.select()
                .from(user)
                .innerJoin(
                    translatorLanguage,
                    eq(user.id, translatorLanguage.translatorId)
                ).where(
                    and(
                        eq(user.role, "translator"),
                        eq(translatorLanguage.languageCode, input.targetLanguage)
                    )
                )
                
            if (!suitableTranslator) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Suitable translator was not found for target language"
                })
            }

            const userId = ctx.user?.id

            const [project] = await ctx.db
                .insert(Project)
                .values({
                    id: nanoid(),
                    name: input.name,
                    description: input.description,
                    sourceLanguage: input.sourceLanguage,
                    targetLanguage: input.targetLanguage,
                    clientId: userId,
                    translatorId: suitableTranslator.user.id,
                    dueAt: input.dueAt 
                        ? new Date(input.dueAt)
                        : null,
                }).returning()
            
            

            await ctx.db.insert(ProjectFile).values({
                id: input.file.fileId,
                projectId: project.id,
                fileName: input.file.fileName,
                contentType: input.file.contentType,
                size: input.file.size,
                storageKey: input.file.storageKey,
                fileType: "SOURCE",
                url: input.file.url
            })

            await ctx.db
                .insert(userActivity)
                .values({
                    id: nanoid(),
                    userId: ctx.user?.id,
                    info: "created a project",
                    activityStatus: "CREATED_PROJECT",
                    activitySeverity: "Info",
                    projectId: project.id
                })

            return { project }
        }),
    getSourceProjectFile: protectedProcedure
        .input(z.object({
            projectId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const user = ctx.user!;
            const [project] = await ctx.db.select()
                .from(Project)
                .where(eq(Project.id, input.projectId))

            if (project.clientId !== user.id 
                && project.translatorId !== user.id
                && user.role as Role !== "admin"
            ) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            }

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Source file to download was not found"
                })
            }

            const [projectFile] = await ctx.db.select()
                .from(ProjectFile)
                .where(and(
                    eq(ProjectFile.projectId, project.id),
                    eq(ProjectFile.fileType, "SOURCE")
                ))

            return {
                projectFile
            }

        }),
    getManyAsTranslator: translatorProcedure
        .input(z.object({
            translatorId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const user = ctx.user
            if (user?.role !== "admin" && (!user || user.id != input.translatorId)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: `User ${user?.name} is not authorized`
                })
            }

            const projects = await getProjectsByTranslatorId(ctx.db, input.translatorId);

            return projects
            
        }),

    uploadTranslatedFile: translatorProcedure
        .input(z.object({
            file: uploadedFileMeta,
            projectId: z.string(),
            setProgressTo100: z.boolean(),
            setQAState: z.boolean(),
            setWaitingForApprovalAcceptState: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {
            const [project] = await ctx.db.select()
                .from(Project)
                .where(eq(Project.id, input.projectId))
        
            if (project.translatorId !== ctx.user?.id) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "NOT AUTHENTICATED"
                })
            }

            
            const translated_file = await ctx.db
                .select()
                .from(ProjectFile)
                .where(and(
                    eq(ProjectFile.fileType, "TRANSLATE"),
                    eq(ProjectFile.projectId, project.id)
                ))

            console.log("translatedFile", translated_file)
            console.log("input", input.file)
            
            const newTranslatedFile = {
                id: input.file.fileId,
                projectId: project.id,
                fileName: input.file.fileName,
                contentType: input.file.contentType,
                size: input.file.size,
                storageKey: input.file.storageKey,
                fileType: "TRANSLATE" as const,
                url: input.file.url
            }

            if (translated_file && translated_file.length > 0) {
                await ctx.db
                    .delete(ProjectFile)
                    .where(
                        and(
                            eq(ProjectFile.projectId, project.id),
                            eq(ProjectFile.fileType, "TRANSLATE")
                        )
                    )
            }

            await ctx.db
                .insert(ProjectFile)
                .values(newTranslatedFile)

            await ctx.db
                .insert(userActivity)
                .values({
                    id: nanoid(),
                    userId: ctx.user?.id,
                    info: `submitted translation`,
                    activityStatus: "TRANSLATION_SUBMITTED",
                    activitySeverity: "Info",
                    projectId: input.projectId
                })

            if (input.setQAState) {
                await ctx.db
                    .update(Project)
                    .set({
                        status: "QA"
                    })
                    .where(eq(Project.id, project.id))
            }

            if (input.setWaitingForApprovalAcceptState) {
                await ctx.db
                    .update(Project)
                    .set({
                        acceptState: "waiting for approval"
                    })
                    .where(eq(Project.id, project.id))

            }

            if (input.setProgressTo100) {
                await ctx.db
                    .update(Project)
                    .set({
                        progressPercent: 100
                    })
                    .where(eq(Project.id, project.id))
            }
            
            return {
                message: "File successfully uploaded",
                project
            }
        }),
    getManyAsUser: protectedProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const user = ctx.user
            console.log("Spouštímeeee")
            if (user?.role !== "admin" && (!user || user.id != input.userId)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: `User ${user?.name} is not authorized`
                })
            }

            const projects = await getProjectsByUserId(ctx.db, input.userId);

            return projects
        }),
    updateProgress: translatorProcedure
        .input(z.object({
            projectId: z.string(),
            newProgress: z
                .number()
                .min(0, { message: "Progress must be higher or equal than 0"})
                .max(100, { message: "Progress must be lower or equal than 100" })
        }))
        .mutation(async ({ ctx, input }) => {
            const loggedUser = ctx.user

            if (!loggedUser) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            }

            const projectsList = await ctx.db
                .select()
                .from(Project)
                .where(and(
                    eq(Project.id, input.projectId),
                    eq(Project.translatorId, loggedUser.id)
                ))
            
            if (!projectsList || projectsList.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found or not assigned to this translator",
                });
            }
                        
            const [updated] = await ctx.db
                .update(Project)
                .set({ progressPercent: input.newProgress })
                .where(eq(Project.id, input.projectId))
                .returning();
            
            return {
                message: "Progress updated successfully",
                project: updated
            }
            
        }),
    getTranslatedFile: protectedProcedure
        .input(z.object({
            projectId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const [project] = await ctx.db.
                select()
                .from(Project)
                .where(eq(Project.id, input.projectId))

            if (project.clientId !== ctx.user?.id 
                && project.translatorId !== ctx.user?.id
                && ctx.user?.role as Role !== "admin"
            ) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            } 
            
            const [projectFile] = await ctx.db.select()
                .from(ProjectFile)
                .where(and(
                    eq(ProjectFile.projectId, project.id),
                    eq(ProjectFile.fileType, "TRANSLATE")
                ))

            return {
                translatedFile: projectFile
            }
        }),
    getProjectById: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;

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
                    companyReview
                })
                .from(Project)
                .leftJoin(client, eq(Project.clientId, client.id))
                .leftJoin(translator, eq(Project.translatorId, translator.id))
                .leftJoin(
                    sourceFile,
                    and(
                        eq(sourceFile.projectId, Project.id),
                        eq(sourceFile.fileType, "SOURCE")
                    )
                )
                .leftJoin(
                    translatedFile,
                    and(
                        eq(translatedFile.projectId, Project.id),
                        eq(translatedFile.fileType, "TRANSLATE")
                    )
                )
                .leftJoin(
                    translatorReview,
                    eq(translatorReview.projectId, Project.id)
                )
                .leftJoin(
                    companyReview,
                    eq(companyReview.projectId, Project.id)
                )
                .where(eq(Project.id, input.id))

            return project
            
        }),
    getProjectsByTranslatorId: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;

            const client = alias(user, "client");
            const translator = alias(user, "translator");

            const sourceFile = alias(ProjectFile, "source_file");
            const targetFile = alias(ProjectFile, "target_file");

            const project = await db
                .select({
                    project: Project,
                    client,
                    translator,
                    sourceFile,
                    targetFile,
                    companyReview,
                    translatorReview
                })
                .from(Project)
                .leftJoin(client, eq(Project.clientId, client.id))
                .leftJoin(translator, eq(Project.translatorId, translator.id))
                .leftJoin(
                    sourceFile,
                    and(
                        eq(sourceFile.projectId, Project.id),
                        eq(sourceFile.fileType, "SOURCE")
                    )
                )
                .leftJoin(
                    targetFile,
                    and(
                        eq(targetFile.projectId, Project.id),
                        eq(targetFile.fileType, "TRANSLATE")
                    )
                )
                .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
                .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
                .where(eq(Project.translatorId, input.id))
                .orderBy(Project.createdAt)

            return {
                project
            }
        }),
    getProjectsByUserId: adminProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;

            const client = alias(user, "client");
            const translator = alias(user, "translator");

            const sourceFile = alias(ProjectFile, "source_file");
            const targetFile = alias(ProjectFile, "target_file");


            const project = await db
                .select({
                    project: Project,
                    client,
                    translator,
                    sourceFile,
                    targetFile,
                    companyReview,
                    translatorReview
                })
                .from(Project)
                .leftJoin(client, eq(Project.clientId, client.id))
                .leftJoin(translator, eq(Project.translatorId, translator.id))
                .leftJoin(
                    sourceFile,
                    and(
                        eq(sourceFile.projectId, Project.id),
                        eq(sourceFile.fileType, "SOURCE")
                    )
                )
                .leftJoin(
                    targetFile,
                    and(
                        eq(targetFile.projectId, Project.id),
                        eq(targetFile.fileType, "TRANSLATE")
                    )
                )
                .leftJoin(companyReview, eq(companyReview.projectId, Project.id))
                .leftJoin(translatorReview, eq(translatorReview.projectId, Project.id))
                .where(eq(Project.clientId, input.userId))

            return {
                project
            }
        }),
    changeProjectStatus: translatorProcedure
        .input(z.object({
            projectId: z.string(),
            projectStatus: z.enum(projectStatus.enumValues)
        }))
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db;
            const role = ctx.user?.role as Role;

            const [project] = await db
                .select()
                .from(Project)
                .where(eq(Project.id, input.projectId))

            if (role !== "admin" && project.translatorId !== ctx.user?.id) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            }

            if (role === "translator" 
                && (input.projectStatus === "DONE"
                || input.projectStatus === "BLOCKED"
                || input.projectStatus === "CLOSED"
                )) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: `Translator cannot change project status to ${input.projectStatus}`
                    })
                }
            
            await db.update(Project)
                .set({
                    status: input.projectStatus
                })
                .where(eq(Project.id, input.projectId))

            const statusActivity = (() => {
                if (input.projectStatus === "DONE") {
                    return {
                        activityStatus: "COMPLETED_PROJECT" as const,
                        activitySeverity: "Success" as const
                    }
                }

                if (input.projectStatus === "CLOSED" || input.projectStatus === "BLOCKED") {
                    return {
                        activityStatus: "PROJECT_CANCELED" as const,
                        activitySeverity: "Warning" as const
                    }
                }

                return {
                    activityStatus: "TRANSLATION_SUBMITTED" as const,
                    activitySeverity: "Info" as const
                }
            })()

            await db.insert(userActivity).values({
                id: nanoid(),
                userId: ctx.user?.id,
                projectId: input.projectId,
                info: `Status changed to ${input.projectStatus}`,
                ...statusActivity
            })

            return {
                success: true
            }

        }),
    getProjectsStats: adminProcedure
        .query(async ({ ctx }) => {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            const excludedStatuses = ["CLOSED", "BLOCKED", "DONE"] as (typeof projectStatus.enumValues)[number][];

            const [stats] = await ctx.db
                .select({
                    total: sql<number>`count(*)`,
                    lastMonth: sql<number>`sum(case when ${Project.createdAt} >= ${oneMonthAgo} then 1 else 0 end)`
                })
                .from(Project)
                .where(not(inArray(Project.status, excludedStatuses)));

            return stats ?? { total: 0, lastMonth: 0 };
        }),
    getCompletedProjectsCount: adminProcedure
        .query(async ({ ctx }) => {
            const completedStatuses = projectStatus.enumValues.filter((status) =>
                isCompleted(status as ProjectStatusType)
            ) as ProjectStatusType[];

            const [result] = await ctx.db
                .select({
                    count: sql<number>`count(*)`
                })
                .from(Project)
                .where(inArray(Project.status, completedStatuses));

            return { count: result?.count ?? 0 };
        }),
    getProjectsCount: adminProcedure
        .query(async ({ ctx }) => {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            const [result] = await ctx.db
                .select({
                    total: sql<number>`count(*)`,
                    lastMonth: sql<number>`sum(case when ${Project.createdAt} >= ${oneMonthAgo} then 1 else 0 end)`
                })
                .from(Project);

            return {
                total: result?.total ?? 0,
                lastMonth: result?.lastMonth ?? 0,
            };
        }),
    getProjectStatuses: adminProcedure
        .query(() => {
            return { statuses: projectStatus.enumValues };
        }),
    getProjectsCreatedLastMonth: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const role = ctx.user?.role as Role
            const signedUserId = ctx.user?.id


            if (role !== "admin"
                && input.id !== signedUserId
            ) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            } 

            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);


            const projects = await ctx.db
                .select()
                .from(Project)
                .where(and(
                    gte(Project.createdAt, oneMonthAgo),
                    eq(Project.clientId, input.id)
                ))

            return {
                projects
            }
        }),
    getProjectStatusCounts: translatorProcedure
        .input(
            z.object({
                translatorId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const requesterRole = ctx.user?.role as Role;

            if (!["admin", "owner"].includes(requesterRole) && ctx.user?.id !== input.translatorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            }

            const activeStatuses = projectStatus.enumValues.filter((status) =>
                isActive(status as ProjectStatusType)
            ) as ProjectStatusType[];

            const completedStatuses = projectStatus.enumValues.filter((status) =>
                isCompleted(status as ProjectStatusType)
            ) as ProjectStatusType[];

            const cancelledStatuses = projectStatus.enumValues.filter((status) =>
                isCancelled(status as ProjectStatusType)
            ) as ProjectStatusType[];

            const [active] = await ctx.db
                .select({ count: sql<number>`count(*)` })
                .from(Project)
                .where(and(eq(Project.translatorId, input.translatorId), inArray(Project.status, activeStatuses)));

            const [completed] = await ctx.db
                .select({ count: sql<number>`count(*)` })
                .from(Project)
                .where(and(eq(Project.translatorId, input.translatorId), inArray(Project.status, completedStatuses)));

            const [cancelled] = await ctx.db
                .select({ count: sql<number>`count(*)` })
                .from(Project)
                .where(and(eq(Project.translatorId, input.translatorId), inArray(Project.status, cancelledStatuses)));

            return {
                active: active?.count ?? 0,
                completed: completed?.count ?? 0,
                cancelled: cancelled?.count ?? 0
            };
        }),
    changeAcceptState: protectedProcedure
        .input(z.object({
            accept: z.enum(ProjectAcceptState.enumValues),
            projectId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const requesterRole = ctx.user?.role as Role;

            const project = await getProjectById(ctx.db, input.projectId)

            if (!["owner", "admin"].includes(requesterRole) && ctx.user?.id !== project.clientId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Not authorized"
                })
            }

            const updatedProject = await ctx.db
                .update(Project)
                .set({
                    acceptState: input.accept
                })
                .where(eq(Project.id, input.projectId))
                .returning()

            if (input.accept === "accepted") {
                await ctx.db.insert(userActivity).values({
                    id: nanoid(),
                    userId: ctx.user?.id,
                    projectId: input.projectId,
                    info: "Customer approved the translation",
                    activityStatus: "COMPLETED_PROJECT",
                    activitySeverity: "Success"
                })
            }

            if (input.accept === "rejected") {
                await ctx.db.insert(userActivity).values({
                    id: nanoid(),
                    userId: ctx.user?.id,
                    projectId: input.projectId,
                    info: "Customer requested revisions",
                    activityStatus: "REVISION_REQUEST",
                    activitySeverity: "Warning"
                })
            }

            return {
                project: updatedProject
            }
        })
})
