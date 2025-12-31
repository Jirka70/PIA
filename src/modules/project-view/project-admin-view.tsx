"use client"

import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useTRPC } from "@/trpc/client"
import { ProjectAdminViewWrapper } from "./project-admin-view-wrapper"
import { ProjectAdminViewSkeleton } from "./project-admin-view-skeleton"
import ProjectNotFound from "./project-not-found"

import { SingleProjectView } from "./single-project-view"
import { ProjectStatusType } from "@/db/schema"

interface ProjectAdminViewProps {
  id: string
}

export const ProjectAdminView = ({ id }: ProjectAdminViewProps) => {

  const trpc = useTRPC()
  const { data, isPending } = useQuery(
    trpc.projects.getProjectById.queryOptions({ id })
  )
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation(trpc.projects.changeProjectStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Status changed")
      },
      onError: (error) => {
        toast.error(error?.message || "Status cannot be changed")
      }
    }))

  const { data: statuses } = useQuery(trpc.projects.getProjectStatuses.queryOptions())

  const onStatusUpdate = async (newStatus: ProjectStatusType) => {
    await updateStatusMutation.mutateAsync({
      projectId: project.id,
      projectStatus: newStatus
    })

    queryClient.setQueryData(
      trpc.projects.getProjectById.queryKey({ id }),
      (cached) => {
        if (!cached?.project) return cached;
        return {
          ...cached,
          project: {
            ...cached.project,
            status: newStatus
          }
        }
      }
    )
  }

  if (isPending) {
    return (
      <ProjectAdminViewWrapper title="Project Details" description="">
        <ProjectAdminViewSkeleton />
      </ProjectAdminViewWrapper>
    )
  }

  if (!data?.project) {
    return <ProjectNotFound />
  }

  const project = data.project
  const client = data.client
  const translator = data.translator
  const sourceFile = data.sourceFile
  const translatedFile = data.translatedFile
  const translatorReview = data.translatorReview
  const companyReview = data.companyReview

  const availableStatuses = statuses?.statuses;

  return (
    <ProjectAdminViewWrapper title="Project Details" description="">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/manage/${translator?.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Manage Translator
          </Link>
        </Button>

        <SingleProjectView
            project={project}
            clientName={client?.name}
            clientEmail={client?.email}
            translatorEmail={translator?.email}
            translatorName={translator?.name}
            sourceFile={sourceFile}
            translatedFile={translatedFile}
            translatorReview={translatorReview}
            companyReview={companyReview}
            onStatusUpdate={onStatusUpdate}
            isStatusUpdating={updateStatusMutation.isPending}
            availableStatuses={availableStatuses}
        />
      </div>
    </ProjectAdminViewWrapper>
  )
}
