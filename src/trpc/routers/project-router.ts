import { translatorLanguage, user } from "@/db/schema";
import { adminProcedure, createTRPCRouter, protectedProcedure, translatorProcedure } from "../init";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import * as projectService from "@/server/services/project.service";
import * as fileService from "@/server/services/file.service";
import * as activityService from "@/server/services/activity.service";
import type { Role } from "@/db/schema";
import { createProjectInput } from "@/lib/validators/trpc/project/create";
import { getSourceProjectFileInput } from "@/lib/validators/trpc/project/getSourceProjectFile";
import { getManyAsTranslatorInput } from "@/lib/validators/trpc/project/getManyAsTranslator";
import { uploadTranslatedFileInput } from "@/lib/validators/trpc/project/uploadTranslatedFile";
import { getManyAsUserInput } from "@/lib/validators/trpc/project/getManyAsUser";
import { updateProgressInput } from "@/lib/validators/trpc/project/updateProgress";
import { getTranslatedFileInput } from "@/lib/validators/trpc/project/getTranslatedFile";
import { getProjectByIdInput } from "@/lib/validators/trpc/project/getProjectById";
import { getProjectsByTranslatorIdInput } from "@/lib/validators/trpc/project/getProjectsByTranslatorId";
import { getProjectsByUserIdInput } from "@/lib/validators/trpc/project/getProjectsByUserId";
import { changeProjectStatusInput } from "@/lib/validators/trpc/project/changeProjectStatus";
import { getProjectsCreatedLastMonthInput } from "@/lib/validators/trpc/project/getProjectsCreatedLastMonth";
import { getProjectStatusCountsInput } from "@/lib/validators/trpc/project/getProjectStatusCounts";
import { changeAcceptStateInput } from "@/lib/validators/trpc/project/changeAcceptState";
import { InsertProjectType, ProjectType } from "@/lib/types/project.type";
import { isBadPayload } from "@/lib/utils";
import { InsertProjectFileType } from "@/lib/types/project-file.type";
import { InsertUserActivityType } from "@/lib/types/userActivity.type";


export const projectRouter = createTRPCRouter({
    create: protectedProcedure
        .input(createProjectInput)
        .mutation(async ({ ctx, input }) => {
            console.log("creating new project, input", input)
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

            const projectPayload : InsertProjectType = {
                id: nanoid(),
                name: input.name,
                description: input.description ?? "",
                sourceLanguage: input.sourceLanguage,
                targetLanguage: input.targetLanguage,
                clientId: userId,
                translatorId: suitableTranslator.user.id,

                dueAt: input.dueAt
                    ? new Date(input.dueAt)
                    : null,
            };

            const insertedProject = await projectService.create(ctx.db, projectPayload);

            if (isBadPayload(insertedProject)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Project is in invalid form",
                    cause: insertedProject.error,
                });
            }

            

            const project: ProjectType = insertedProject;
            const projectFilePayload : InsertProjectFileType = {
                id: nanoid(), // keep DB PK unique even if upload id is reused
                projectId: project.id,
                fileName: input.file.fileName,
                contentType: input.file.contentType,
                size: input.file.size,
                storageKey: input.file.storageKey,
                fileType: "SOURCE",
                url: input.file.url
            }

            const insertedProjectFile = await fileService.create(ctx.db, projectFilePayload)
            
            if (isBadPayload(insertedProjectFile)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Project file is in invalid form",
                    cause: insertedProjectFile.error,
                });
            }

            const activityPayload : InsertUserActivityType = {
                    id: nanoid(),
                    userId: ctx.user?.id,
                    info: "created a project",
                    activityStatus: "CREATED_PROJECT",
                    activitySeverity: "Info",
                    projectId: project.id
                } 

            await activityService.create(ctx.db, activityPayload)
            return { project }
    }),
    getSourceProjectFile: protectedProcedure
        .input(getSourceProjectFileInput)
        .mutation(async ({ ctx, input }) => {
            const result = await projectService.getProjectSourceFile(ctx.db, input, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;

        }),
    getManyAsTranslator: translatorProcedure
        .input(getManyAsTranslatorInput)
        .query(async ({ ctx, input }) => {
            const result = await projectService.listTranslatorProjects(ctx.db, input.translatorId, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;            
        }),

    uploadTranslatedFile: translatorProcedure
        .input(uploadTranslatedFileInput)
        .mutation(async ({ ctx, input }) => {
            const result = await projectService.uploadTranslatedProjectFile(ctx.db, input, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }
            
            return result
    }),
    getManyAsUser: protectedProcedure
        .input(getManyAsUserInput)
        .query(async ({ ctx, input }) => {
            const result = await projectService.listClientProjects(ctx.db, input.userId, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result
    }),
    updateProgress: translatorProcedure
        .input(updateProgressInput)
        .mutation(async ({ ctx, input }) => {
            const result = await projectService.updateProjectProgressForTranslator(ctx.db, input, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }
            
            return result
            
        }),
    getTranslatedFile: protectedProcedure
        .input(getTranslatedFileInput)
        .mutation(async ({ ctx, input }) => {
            const result = await projectService.getProjectTranslatedFile(ctx.db, input, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }
            
            return result
    }),
    getProjectById: adminProcedure
        .input(getProjectByIdInput)
        .query(async ({ ctx, input }) => {
            const result = await projectService.getProjectWithRelationsById(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result
            
    }),
    getProjectsByTranslatorId: adminProcedure
        .input(getProjectsByTranslatorIdInput)
        .query(async ({ ctx, input }) => {
            const result = await projectService.listProjectsWithDetailsByTranslatorId(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result
    }),
    getProjectsByUserId: adminProcedure
        .input(getProjectsByUserIdInput)
        .query(async ({ ctx, input }) => {
            const result = await projectService.listProjectsWithDetailsByClientId(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result
    }),
    changeProjectStatus: translatorProcedure
        .input(changeProjectStatusInput)
        .mutation(async ({ ctx, input }) => {
            const result = await projectService.updateProjectStatusWithAuthorization(ctx.db, input, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result

        }),
    getProjectsStats: adminProcedure
        .query(async ({ ctx }) => {
            const stats = await projectService.getActiveProjectsStats(ctx.db);
            return stats;
        }),
    getCompletedProjectsCount: adminProcedure
        .query(async ({ ctx }) => {
            return projectService.countCompletedProjects(ctx.db);
        }),
    getProjectsCount: adminProcedure
        .query(async ({ ctx }) => {
            return projectService.countProjectsWithRecent(ctx.db);
        }),
    getProjectStatuses: adminProcedure
        .query(() => {
            return projectService.listProjectStatuses();
    }),
    getProjectsCreatedLastMonth: protectedProcedure
        .input(getProjectsCreatedLastMonthInput)
        .query(async ({ ctx, input }) => {
            const result = await projectService.listProjectsCreatedLastMonthByClientId(ctx.db, input, ctx.user!);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result
    }),
    getProjectStatusCounts: translatorProcedure
        .input(getProjectStatusCountsInput)
        .query(async ({ ctx, input }) => {
            const currentUser = {
                id: ctx.user!.id,
                role: ctx.user!.role as Role,
                name: ctx.user!.name ?? null,
            };
            const result = await projectService.countTranslatorProjectsByStatusGroups(ctx.db, input, currentUser);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
    }),
    changeAcceptState: protectedProcedure
        .input(changeAcceptStateInput)
        .mutation(async ({ ctx, input }) => {
            const currentUser = {
                id: ctx.user!.id,
                role: ctx.user!.role as Role,
                name: ctx.user!.name ?? null,
            };
            const result = await projectService.updateProjectAcceptStateWithAuthorization(ctx.db, input, currentUser);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        })
})
