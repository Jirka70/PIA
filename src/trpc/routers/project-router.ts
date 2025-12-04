import { companyReview, Project, ProjectFile, projectStatus, Role, translatorLanguage, translatorReview, user, userActivity } from "@/db/schema";
import { adminProcedure, createTRPCRouter, protectedProcedure, translatorProcedure } from "../init";
import { eq, and, getTableColumns, sql, inArray, gte, desc } from "drizzle-orm"
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createProjectInput } from "@/lib/validators/create-project-schema";
import z from "zod";
import { uploadedFileMeta } from "@/lib/validators/uploaded-file-meta";
import { alias } from "drizzle-orm/pg-core";



export const projectRouter = createTRPCRouter({
    create: protectedProcedure
        .input(createProjectInput)
        .mutation(async ({ ctx, input }) => {
            const suitableTranslator = await ctx.db.select({
                    id: user.id,
                    name: user.name
                }).from(user)
                .innerJoin(
                    translatorLanguage,
                    eq(user.id, translatorLanguage.translatorId)
                ).where(
                    and(
                        eq(user.role, "translator"),
                        eq(translatorLanguage.languageCode, input.targetLanguage)
                    )
                )
                .limit(1)
                
            if (!suitableTranslator || suitableTranslator.length === 0) {
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
                    sourceLanguage: "cs",
                    targetLanguage: input.targetLanguage,
                    clientId: userId,
                    translatorId: suitableTranslator[0].id,
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

            const sourceFile = alias(ProjectFile, "source_file");
            const targetFile = alias(ProjectFile, "target_file");

            const projects = await ctx.db
                .select({
                    project: Project,
                    sourceFile,
                    targetFile,
                    companyReview,
                    translatorReview
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
                .leftJoin(
                    companyReview,
                    eq(companyReview.projectId, Project.id)
                )
                .leftJoin(
                    translatorReview,
                    and(
                        eq(translatorReview.projectId, Project.id),
                        eq(translatorReview.translatorId, Project.translatorId)
                    )
                )
                .where(eq(Project.translatorId, input.translatorId))
                .orderBy(desc(Project.updatedAt))
            
            if (!projects) {
                return {
                    projects: []
                }
            }

            return {
                projects
            }
        }),

    uploadTranslatedFile: translatorProcedure
        .input(z.object({
            file: uploadedFileMeta,
            projectId: z.string(),
            setProgressTo100: z.boolean(),
            setQAState: z.boolean()
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

            await ctx.db
                .insert(ProjectFile)
                .values({
                    id: input.file.fileId,
                    projectId: project.id,
                    fileName: input.file.fileName,
                    contentType: input.file.contentType,
                    size: input.file.size,
                    storageKey: input.file.storageKey,
                    fileType: "TRANSLATE",
                    url: input.file.url
                })

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

            return {
                message: "File successfully uploaded"
            }
        }),
    getManyAsUser: protectedProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const user = ctx.user
            if (user?.role !== "admin" && (!user || user.id != input.userId)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: `User ${user?.name} is not authorized`
                })
            }

            const projects = await ctx.db
                .select()
                .from(Project)
                .where(eq(Project.clientId, input.userId))
            
            if (!projects) {
                return {
                    projects: []
                }
            }

            return {
                projects
            }
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

            const [project] = await db
                .select()
                .from(Project)
                .leftJoin(client, eq(Project.clientId, client.id))
                .leftJoin(translator, eq(Project.translatorId, translator.id))
                .where(eq(Project.id, input.id))

            return {
                project
            }
        }),
    getProjectsByTranslatorId: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;

            const client = alias(user, "client");
            const translator = alias(user, "translator");

            const project = await db
                .select()
                .from(Project)
                .leftJoin(client, eq(Project.clientId, client.id))
                .leftJoin(translator, eq(Project.translatorId, translator.id))
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

            const project = await db
                .select()
                .from(Project)
                .leftJoin(client, eq(Project.clientId, client.id))
                .leftJoin(translator, eq(Project.translatorId, translator.id))
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

            return {
                success: true
            }

        }),
    getProjectStatuses: translatorProcedure
        .query(async () => {
            return projectStatus.enumValues;
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
        })
})