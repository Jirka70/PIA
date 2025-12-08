"use client"

import { Button } from "@/components/ui/button"
import { ProjectAdminViewSkeleton } from "@/modules/project-view/project-admin-view-skeleton"
import { ProjectAdminViewWrapper } from "@/modules/project-view/project-admin-view-wrapper"
import ProjectNotFound from "@/modules/project-view/project-not-found"
import { SingleProjectView } from "@/modules/project-view/single-project-view"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProjectView } from "./project-view"
import { toast } from "sonner"
import { ProjectStatus, ProjectStatusType } from "@/db/schema"

interface TranslatorProjectProps {
    translatorId: string,
    projectId: string
}

export const TranslatorProject = ({ translatorId, projectId } : TranslatorProjectProps) => {
    const trpc = useTRPC()
    const { data: projectInfo, isPending } = useQuery(trpc.projects.getProjectById.queryOptions({
        id: projectId
    }))
    const queryClient = useQueryClient();

    const { mutateAsync: updateStatus, isPending: isStatusUpdating } = useMutation(trpc.projects.changeProjectStatus.mutationOptions({
        onSuccess: () => {
            toast.success("Status successfully updated")
        },
        onError: (error) => {
            toast.error(error.message || "Cannot update status right now")
        }
    }))

    if (isPending) {
        return (
            <ProjectAdminViewWrapper title="Project Details" description="">
                <ProjectAdminViewSkeleton />
            </ProjectAdminViewWrapper>
        )
    }

    if (projectInfo?.translator?.id !== translatorId) {
        return <ProjectNotFound />
    }

    const project = projectInfo.project
    const client = projectInfo.client
    const sourceFile = projectInfo.sourceFile
    const translatedFile = projectInfo.translatedFile
    const translatorReview = projectInfo.translatorReview
    const companyReview = projectInfo.companyReview

    const onStatusUpdate = async (newStatus: ProjectStatusType) => {
        await updateStatus({
            projectId: project.id,
            projectStatus: newStatus
        })

        // update for current page
        queryClient.setQueryData(
            trpc.projects.getProjectById.queryKey({ id: project.id }),
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
        
        // update for translator page
        queryClient.setQueryData(
            trpc.users.getTranslatorInfo.queryKey({
                id: project.translatorId!
            }),
            (cached) => {
                if (!cached?.projects) return cached;
                return {
                    ...cached,
                    projects: cached.projects.map((row) => row.id === project.id 
                        ? {...row, status: newStatus}
                        : row)
                }
            }
        )
        
    }

    return (
        <ProjectView
            project={project}
            clientName={client?.name}
            clientEmail={client?.email}
            sourceFile={sourceFile}
            translatedFile={translatedFile}
            translatorReview={translatorReview}
            companyReview={companyReview}
            isStatusUpdating={isStatusUpdating}
            onStatusUpdate={onStatusUpdate}
        />
    )
}