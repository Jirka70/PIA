"use client"

import { ProjectAdminViewSkeleton } from "@/modules/project-view/project-admin-view-skeleton"
import { ProjectAdminViewWrapper } from "@/modules/project-view/project-admin-view-wrapper"
import ProjectNotFound from "@/modules/project-view/project-not-found"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProjectView } from "./project-view"
import { toast } from "sonner"
import { ProjectStatusType } from "@/db/schema"

interface TranslatorProjectProps {
    userId: string,
    projectId: string
}

export const UserProject = ({ userId, projectId } : TranslatorProjectProps) => {
    const trpc = useTRPC()
    const { data: projectInfo, isPending } = useQuery(trpc.projects.getProjectById.queryOptions({
        id: projectId
    }))

    console.log("projectInfo", projectInfo)

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

    if (projectInfo?.client?.id !== userId) {
        return <ProjectNotFound />
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
        
        queryClient.setQueryData(
            trpc.users.getUserInfo.queryKey({
                id: project.clientId!
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
            translatorName={translator?.name}
            translatorEmail={translator?.email}
            translatedFile={translatedFile}
            translatorReview={translatorReview}
            companyReview={companyReview}
            isStatusUpdating={isStatusUpdating}
            onStatusUpdate={onStatusUpdate}
            backButtonLink={`/admin/user/${project.clientId}`}
            backButtonText="Manage User"
        />
    )
}