"use client"

import { ProjectAdminViewSkeleton } from "@/modules/project-view/project-admin-view-skeleton"
import { ProjectAdminViewWrapper } from "@/modules/project-view/project-admin-view-wrapper"
import ProjectNotFound from "@/modules/project-view/project-not-found"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProjectView } from "./project-view"
import { toast } from "sonner"
import { ProjectStatusType } from "@/db/schema"
import { useTranslations } from "next-intl"

interface TranslatorProjectProps {
  translatorId: string
  projectId: string
}

export const TranslatorProject = ({ translatorId, projectId }: TranslatorProjectProps) => {
  const t = useTranslations("TranslatorProject")

  const trpc = useTRPC()
  const { data: projectInfo, isPending } = useQuery(
    trpc.projects.getProjectById.queryOptions({
      id: projectId
    })
  )
  const queryClient = useQueryClient()

  const { mutateAsync: updateStatus, isPending: isStatusUpdating } = useMutation(
    trpc.projects.changeProjectStatus.mutationOptions({
      onSuccess: () => {
        toast.success(t("toasts.statusUpdated"))
      },
      onError: (error) => {
        toast.error(error.message || t("toasts.statusUpdateError"))
      }
    })
  )

  const { data: statuses } = useQuery(trpc.projects.getProjectStatuses.queryOptions())


  if (isPending) {
    return (
      <ProjectAdminViewWrapper title={t("wrapper.title")} description={t("wrapper.description")}>
        <ProjectAdminViewSkeleton />
      </ProjectAdminViewWrapper>
    )
  }

  if (projectInfo?.translator?.id !== translatorId) {
    return <ProjectNotFound />
  }

  const onClientClick = async (clientId: string) => {
    window.open(`/admin/user/${clientId}`, "_blank")
  }

  const onTranslatorClick = async (translatorId: string) => {
    window.open(`/admin/translator/${translatorId}`, "_blank")
  }

  const project = projectInfo.project
  const client = projectInfo.client
  const sourceFile = projectInfo.sourceFile
  const translatedFile = projectInfo.translatedFile
  const translatorReview = projectInfo.translatorReview
  const companyReview = projectInfo.companyReview
  const translator = projectInfo.translator

  const onStatusUpdate = async (newStatus: ProjectStatusType) => {
    await updateStatus({
      projectId: project.id,
      projectStatus: newStatus
    })

    // update for current page
    queryClient.setQueryData(trpc.projects.getProjectById.queryKey({ id: project.id }), (cached) => {
      if (!cached?.project) return cached
      return {
        ...cached,
        project: {
          ...cached.project,
          status: newStatus
        }
      }
    })

    // update for translator page
    queryClient.setQueryData(
      trpc.users.getTranslatorInfo.queryKey({
        id: project.translatorId!
      }),
      (cached) => {
        if (!cached?.projects) return cached
        return {
          ...cached,
          projects: cached.projects.map((row) => (row.id === project.id ? { ...row, status: newStatus } : row))
        }
      }
    )
  }

  const availableStatuses = statuses?.statuses

  return (
    <ProjectView
      project={project}
      clientName={client?.name}
      clientEmail={client?.email}
      sourceFile={sourceFile}
      translatedFile={translatedFile}
      translatorReview={translatorReview}
      translatorName={translator.name}
      translatorEmail={translator.email}
      companyReview={companyReview}
      isStatusUpdating={isStatusUpdating}
      onStatusUpdate={onStatusUpdate}
      backButtonLink={`/admin/translator/${project.translatorId}`}
      backButtonText={t("actions.backToTranslator")}
      onClientClick={onClientClick}
      onTranslatorClick={onTranslatorClick}
      availableStatuses={availableStatuses}
    />
  )
}
