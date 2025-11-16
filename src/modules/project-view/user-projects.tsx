"use client"

import { Role } from "@/db/schema"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { SingleProjectView } from "./single-project-view"
import { ProjectAdminViewWrapper } from "./project-admin-view-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjectAdminViewSkeleton } from "./project-admin-view-skeleton"

interface UserProjectsProps {
    userRole: Role,
    userId: string
}

export const UserProjects = ({ userRole, userId } : UserProjectsProps) => {
    
    const trpc = useTRPC()
    const { data: rawUser, isPending: isGettingUser } = useQuery(trpc.users.getUserById.queryOptions({
        id: userId
    }))

    const isTranslator = userRole === "translator"

    const { data: projects, isPending: isProjectsPending } = isTranslator
    ? useQuery(trpc.projects.getProjectsByTranslatorId.queryOptions({
        userId
    })) 
    : useQuery(trpc.projects.getProjectsByUserId.queryOptions({
        userId
    }))

    const user = rawUser?.user

    if (isProjectsPending || isGettingUser) {
        return (
            <ProjectAdminViewWrapper title="View projects" description="">
                <ProjectAdminViewSkeleton />
                <ProjectAdminViewSkeleton />
                <ProjectAdminViewSkeleton />
            </ProjectAdminViewWrapper>
            
        )
    }

    if (!user) {
        notFound();
    }

    return (
        <ProjectAdminViewWrapper title="View projects" description="">
          <div className="space-y-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/user-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            {projects?.project.length === 0
                ? <p>No projects found</p>
                : (
            projects?.project.map((projectEntry) => {
                const project = projectEntry.project;
                const client = projectEntry.client;
                const translator = projectEntry.translator
                return (
                    <SingleProjectView key={project.id}
                        project={project}
                        clientName={client?.name}
                        clientEmail={client?.email}
                        translatorName={translator?.name}
                        translatorEmail={translator?.email}
                    />
                )
            }))}

            </div>
        </ProjectAdminViewWrapper>
    )
}