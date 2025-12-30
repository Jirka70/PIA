"use client"

import { ProjectStatusType, Role } from "@/db/schema"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
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
  const { data: rawUser, isPending: isGettingUser } = useQuery(
    trpc.users.getUserById.queryOptions({
      id: userId
    })
  )

  const isTranslator = userRole === "translator"

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
                isStatusUpdating={false}
                onStatusUpdate={async (_newStatus: ProjectStatusType) => {}}
              />
            )
          })
        )}
      </div>
    </ProjectAdminViewWrapper>
  )
}
