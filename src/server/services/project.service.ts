import { Role, projectStatus, ProjectStatusType } from "@/db/schema";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { DB } from "@/lib/types/db.type";
import {
  AdminTranslatorProjectsInput,
  AdminUserProjectsInput,
  ChangeAcceptStateInput,
  ChangeProjectStatusInput,
  ProjectIdInput,
  ProjectStatusCountsInput,
  ProjectsCreatedLastMonthInput,
  SourceFileInput,
  TranslatorIdInput,
  TranslatedFileInput,
  UpdateProgressInput,
  UploadTranslatedFileInput,
  UserIdInput,
} from "@/lib/types/project-input.type";
import { InsertProjectFileType } from "@/lib/types/project-file.type";
import { InsertProjectType, ProjectType } from "@/lib/types/project.type";
import { InsertUserActivityType } from "@/lib/types/userActivity.type";
import { isActive, isCancelled, isCompleted } from "@/lib/project-status-utils";
import { isBadPayload } from "@/lib/utils";
import { changeAcceptStateInput } from "@/lib/validators/trpc/project/changeAcceptState";
import { changeProjectStatusInput } from "@/lib/validators/trpc/project/changeProjectStatus";
import { getManyAsTranslatorInput } from "@/lib/validators/trpc/project/getManyAsTranslator";
import { getManyAsUserInput } from "@/lib/validators/trpc/project/getManyAsUser";
import { getProjectByIdInput } from "@/lib/validators/trpc/project/getProjectById";
import { getProjectsByTranslatorIdInput } from "@/lib/validators/trpc/project/getProjectsByTranslatorId";
import { getProjectsByUserIdInput } from "@/lib/validators/trpc/project/getProjectsByUserId";
import { getProjectsCreatedLastMonthInput } from "@/lib/validators/trpc/project/getProjectsCreatedLastMonth";
import { getSourceProjectFileInput } from "@/lib/validators/trpc/project/getSourceProjectFile";
import { getTranslatedFileInput } from "@/lib/validators/trpc/project/getTranslatedFile";
import { insertProjectSchema } from "@/lib/validators/trpc/project/project-schema";
import { getProjectStatusCountsInput } from "@/lib/validators/trpc/project/getProjectStatusCounts";
import { updateProgressInput } from "@/lib/validators/trpc/project/updateProgress";
import { uploadTranslatedFileInput } from "@/lib/validators/trpc/project/uploadTranslatedFile";
import * as activityService from "@/server/services/activity.service";
import * as fileService from "@/server/services/file.service";
import * as projectRepo from "@/server/repositories/project.repo";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

type CurrentUser = {
  id: string;
  role: Role | string;
  name?: string | null;
};

export async function create(db: DB, input: InsertProjectType): Promise<ProjectType | BadPayloadType> {
  const parsed = insertProjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  return projectRepo.createProject(db, input);
}

export async function getProjectSourceFile(db: DB, input: SourceFileInput, user: CurrentUser) {
  const parsed = getSourceProjectFileInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Source file to download was not found",
    });
  }

  if (project.clientId !== user.id && project.translatorId !== user.id && (user.role as Role) !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  const projectFile = await fileService.getByType(db, project.id, "SOURCE");

  return { projectFile };
}

export async function listTranslatorProjects(db: DB, translatorId: TranslatorIdInput, user: CurrentUser) {
  const parsed = getManyAsTranslatorInput.safeParse({ translatorId });

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if (user.role !== "admin" && (!user || user.id !== parsed.data.translatorId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `User ${user?.name} is not authorized`,
    });
  }

  const projects = await projectRepo.listProjectsWithDetailsByTranslatorId(db, parsed.data.translatorId);
  return { projects };
}

export async function uploadTranslatedProjectFile(db: DB, input: UploadTranslatedFileInput, user: CurrentUser) {
  const parsed = uploadTranslatedFileInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  if (project.translatorId !== user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "NOT AUTHENTICATED",
    });
  }

  const newTranslatedFile: InsertProjectFileType = {
    id: parsed.data.file.fileId,
    projectId: project.id,
    fileName: parsed.data.file.fileName,
    contentType: parsed.data.file.contentType,
    size: parsed.data.file.size,
    storageKey: parsed.data.file.storageKey,
    fileType: "TRANSLATE",
    url: parsed.data.file.url,
  };

  const insertedFile = await fileService.replaceFileOfType(db, newTranslatedFile, "TRANSLATE");

  if (isBadPayload(insertedFile)) {
    return insertedFile;
  }

  const activityPayload: InsertUserActivityType = {
    id: nanoid(),
    userId: user.id,
    info: `submitted translation`,
    activityStatus: "TRANSLATION_SUBMITTED",
    activitySeverity: "Info",
    projectId: parsed.data.projectId,
  };

  await activityService.create(db, activityPayload);

  if (parsed.data.setQAState) {
    await projectRepo.updateProjectStatusToQA(db, project.id);
  }

  if (parsed.data.setWaitingForApprovalAcceptState) {
    await projectRepo.updateProjectAcceptStateToWaitingForApproval(db, project.id);
  }

  if (parsed.data.setProgressTo100) {
    await projectRepo.updateProjectProgressToHundred(db, project.id);
  }

  return {
    message: "File successfully uploaded",
    project,
  };
}

export async function listClientProjects(db: DB, userId: UserIdInput, user: CurrentUser) {
  const parsed = getManyAsUserInput.safeParse({ userId });

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if (user.role !== "admin" && (!user || user.id !== parsed.data.userId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `User ${user?.name} is not authorized`,
    });
  }

  const projects = await projectRepo.listProjectsWithDetailsByClientId(db, parsed.data.userId);
  return { projects };
}

export async function updateProjectProgressForTranslator(db: DB, input: UpdateProgressInput, user: CurrentUser) {
  const parsed = updateProgressInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (!project || project.translatorId !== user.id) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found or not assigned to this translator",
    });
  }

  const [updated] = await projectRepo.updateProjectProgress(db, parsed.data.projectId, parsed.data.newProgress);

  return {
    message: "Progress updated successfully",
    project: updated,
  };
}

export async function getProjectTranslatedFile(db: DB, input: TranslatedFileInput, user: CurrentUser) {
  const parsed = getTranslatedFileInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (
    !project ||
    (project.clientId !== user.id && project.translatorId !== user.id && (user.role as Role) !== "admin")
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  const translatedFile = await fileService.getByType(db, project.id, "TRANSLATE");
  return { translatedFile };
}

export async function getProjectWithRelationsById(db: DB, input: ProjectIdInput) {
  const parsed = getProjectByIdInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectWithRelationsById(db, parsed.data.id);
  return project;
}

export async function listProjectsWithDetailsByTranslatorId(db: DB, input: AdminTranslatorProjectsInput) {
  const parsed = getProjectsByTranslatorIdInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.listProjectsWithReviewsByTranslatorId(db, parsed.data.id);
  return { project };
}

export async function listProjectsWithDetailsByClientId(db: DB, input: AdminUserProjectsInput) {
  const parsed = getProjectsByUserIdInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.listProjectsWithReviewsByClientId(db, parsed.data.userId);
  return { project };
}

export async function updateProjectStatusWithAuthorization(db: DB, input: ChangeProjectStatusInput, user: CurrentUser) {
  const parsed = changeProjectStatusInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  if ((user.role as Role) !== "admin" && project.translatorId !== user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  if (
    user.role === "translator" &&
    (parsed.data.projectStatus === "DONE" || parsed.data.projectStatus === "BLOCKED" || parsed.data.projectStatus === "CLOSED")
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Translator cannot change project status to ${parsed.data.projectStatus}`,
    });
  }

  await projectRepo.updateProjectStatus(db, parsed.data.projectId, parsed.data.projectStatus);

  return {
    success: true,
  };
}

export async function getActiveProjectsStats(db: DB) {
  const excludedStatuses = ["CLOSED", "BLOCKED", "DONE"] as (typeof projectStatus.enumValues)[number][];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const stats = await projectRepo.getProjectStatsExcludingStatusesSince(db, excludedStatuses, oneMonthAgo);
  return stats ?? { total: 0, lastMonth: 0 };
}

export async function countCompletedProjects(db: DB) {
  const completedStatuses = projectStatus.enumValues.filter((status) =>
    isCompleted(status as ProjectStatusType),
  ) as ProjectStatusType[];

  const count = await projectRepo.countProjectsByStatuses(db, completedStatuses);
  return { count };
}

export async function countProjectsWithRecent(db: DB) {
  return projectRepo.countProjectsWithRecentCreated(db);
}

export async function listProjectStatuses() {
  return { statuses: projectStatus.enumValues };
}

export async function listProjectsCreatedLastMonthByClientId(
  db: DB,
  input: ProjectsCreatedLastMonthInput,
  user: CurrentUser,
) {
  const parsed = getProjectsCreatedLastMonthInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if ((user.role as Role) !== "admin" && parsed.data.id !== user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const projects = await projectRepo.listClientProjectsCreatedSince(db, parsed.data.id, oneMonthAgo);
  return { projects };
}

export async function countTranslatorProjectsByStatusGroups(
  db: DB,
  input: ProjectStatusCountsInput,
  user: CurrentUser & { role: Role },
) {
  const parsed = getProjectStatusCountsInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if (!["admin", "owner"].includes(user.role as Role) && user.id !== parsed.data.translatorId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  const activeStatuses = projectStatus.enumValues.filter((status) => isActive(status as ProjectStatusType)) as ProjectStatusType[];
  const completedStatuses = projectStatus.enumValues.filter((status) =>
    isCompleted(status as ProjectStatusType),
  ) as ProjectStatusType[];
  const cancelledStatuses = projectStatus.enumValues.filter((status) =>
    isCancelled(status as ProjectStatusType),
  ) as ProjectStatusType[];

  const active = await projectRepo.countProjectsByStatusesForTranslator(db, parsed.data.translatorId, activeStatuses);
  const completed = await projectRepo.countProjectsByStatusesForTranslator(db, parsed.data.translatorId, completedStatuses);
  const cancelled = await projectRepo.countProjectsByStatusesForTranslator(db, parsed.data.translatorId, cancelledStatuses);

  return {
    active,
    completed,
    cancelled,
  };
}

export async function updateProjectAcceptStateWithAuthorization(
  db: DB,
  input: ChangeAcceptStateInput,
  user: CurrentUser & { role: Role },
) {
  const parsed = changeAcceptStateInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const project = await projectRepo.findProjectById(db, parsed.data.projectId);

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  if (!["owner", "admin"].includes(user.role as Role) && user.id !== project.clientId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  const updatedProject = await projectRepo.updateProjectAcceptState(db, parsed.data.projectId, parsed.data.accept);

  return {
    project: updatedProject,
  };
}
