import { Project, ProjectFile, translatorLanguage, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure, translatorProcedure } from "../init";
import { eq, and } from "drizzle-orm"
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createProjectInput } from "@/lib/validators/create-project-schema";
import z from "zod";


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

            const [projectFile] = await ctx.db.insert(ProjectFile).values({
                id: nanoid(),
                projectId: project.id,
                fileName: input.file.fileName,
                contentType: input.file.contentType,
                size: input.file.size,
                storageKey: input.file.storageKey,
                url: input.file.url
            }).returning()


            await ctx.db
                .update(Project)
                .set({ sourceFileId: projectFile.id})
                .where(eq(Project.id, project.id))

            return { project }
        }),
    getSourceProjectFile: protectedProcedure
        .input(z.object({
            projectId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const user = ctx.user!;
            const [project] = await ctx.db.select()
                .from(Project)
                .where(eq(Project.id, input.projectId))

            if (project.clientId !== user.id 
                && project.translatorId !== user.id
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
                .where(eq(ProjectFile.id, project.sourceFileId!))

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
            if (!user || user.id != input.translatorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: `User ${user?.name} is not authorized`
                })
            }

            const projects = await ctx.db
                .select()
                .from(Project)
                .where(eq(Project.translatorId, input.translatorId))
            
            if (!projects) {
                return {
                    projects: []
                }
            }

            return {
                projects
            }
        }),
    getManyAsUser: protectedProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const user = ctx.user
            if (!user || user.id != input.userId) {
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
                // User is searching for wrong project -- ERROR
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
            
        })
})