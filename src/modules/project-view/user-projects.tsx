"use client"

import { ProjectStatusType, Role } from "@/db/schema"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { SingleProjectView } from "./single-project-view"
import { ProjectAdminViewWrapper } from "./project-admin-view-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjectAdminViewSkeleton } from "./project-admin-view-skeleton"
import { useTranslations } from "next-intl"

interface UserProjectsProps {
  userRole: Role
  userId: string
}

export const UserProjects = ({ userRole, userId }: UserProjectsProps) => {
  const t = useTranslations("UserProjects")
  const trpc = useTRPC()
  const queryClient = useQueryClient();
  const isTranslator = userRole === "translator"


  const updateStatus = useMutation(trpc.projects.changeProjectStatus.mutationOptions());
  const onStatusUpdate = async (newStatus: ProjectStatusType, projectId: string) => {
    await updateStatus.mutateAsync({
      projectId,
      projectStatus: newStatus
    })

    const queryKey = isTranslator
      ? trpc.projects.getProjectsByTranslatorId.queryKey({ id: userId })
      : trpc.projects.getProjectsByUserId.queryKey({ userId })

    queryClient.setQueryData(queryKey, (cached) => {
      if (!cached || !cached.project) return cached

      return {
        ...cached,
        project: cached.project.map((entry) =>
          entry.project.id === projectId
            ? { ...entry, project: { ...entry.project, status: newStatus } }
            : entry
        )
      }
    })
  }

  const { data: rawUser, isPending: isGettingUser } = useQuery(
    trpc.users.getUserById.queryOptions({
      id: userId
    })
  )


  const { data: statuses } = useQuery(trpc.projects.getProjectStatuses.queryOptions())


  const { data: projectsInfo, isPending: isProjectsPending } = isTranslator
    ? useQuery(
        trpc.projects.getProjectsByTranslatorId.queryOptions({
          id: userId
        })
      )
    : useQuery(
        trpc.projects.getProjectsByUserId.queryOptions({
          userId
        })
      )

  const user = rawUser?.user
  const availableStatuses = statuses?.statuses;

  if (isProjectsPending || isGettingUser) {
    return (
      <ProjectAdminViewWrapper title={t("wrapper.title")} description={t("wrapper.description")}>
        <ProjectAdminViewSkeleton />
        <ProjectAdminViewSkeleton />
        <ProjectAdminViewSkeleton />
      </ProjectAdminViewWrapper>
    )
  }

  if (!user) {
    notFound()
  }

  const onClientClick = async (clientId: string) => {
    window.open(`/admin/user/${clientId}`, "_blank")
  }

  const onTranslatorClick = async (translatorId: string) => {
    window.open(`/admin/translator/${translatorId}`, "_blank")
  }

  const projects = projectsInfo?.project

  return (
    <ProjectAdminViewWrapper title={t("wrapper.title")} description={t("wrapper.description")}>
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user-dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("actions.backToDashboard")}
          </Link>
        </Button>

        {projects?.length === 0 ? (
          <p>{t("states.noProjects")}</p>
        ) : (
          projects?.map((projectEntry) => {
            const project = projectEntry.project
            const client = projectEntry.client
            const translator = projectEntry.translator
            const companyReview = projectEntry.companyReview
            const translatorReview = projectEntry.translatorReview
            const sourceFile = projectEntry.sourceFile
            const translatedFile = projectEntry.targetFile

            return (
              <SingleProjectView
                key={project.id}
                project={project}
                clientName={client?.name}
                clientEmail={client?.email}
                translatorName={translator?.name}
                translatorEmail={translator?.email}
                companyReview={companyReview}
                translatorReview={translatorReview}
                sourceFile={sourceFile}
                isStatusUpdating={updateStatus.isPending}
                translatedFile={translatedFile}
                onStatusUpdate={onStatusUpdate}
                availableStatuses={availableStatuses}
                onTranslatorClick={onTranslatorClick}
                onClientClick={onClientClick}
              />
            )
          })
        )}
      </div>
    </ProjectAdminViewWrapper>
  )
}
