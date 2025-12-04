"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useTRPC } from "@/trpc/client"
import { ProjectAdminViewWrapper } from "./project-admin-view-wrapper"
import { ProjectAdminViewSkeleton } from "./project-admin-view-skeleton"
import ProjectNotFound from "./project-not-found"

import { SingleProjectView } from "./single-project-view"

interface ProjectAdminViewProps {
  id: string
}

export const ProjectAdminView = ({ id }: ProjectAdminViewProps) => {

  const trpc = useTRPC()
  const { data, isPending } = useQuery(
    trpc.projects.getProjectById.queryOptions({ id })
  )

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

  const project = data.project.project
  const client = data.project.client
  const translator = data.project.translator

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
        />
      </div>
    </ProjectAdminViewWrapper>
  )
}
