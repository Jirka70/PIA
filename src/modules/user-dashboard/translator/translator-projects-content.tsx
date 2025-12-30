"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { User } from "better-auth"
import { ProjectToTranslate } from "./project-to-translate"
import { ProjectListSkeleton } from "../project-list-skeleton"
import { useTranslations } from "next-intl"

interface ProjectsContentProps {
  user: User
}

export const ProjectsContent = ({ user }: ProjectsContentProps) => {
  const t = useTranslations("TranslatorProjectsContent")
  const trpc = useTRPC()

  const { data, isLoading, isError, isFetching, error } = useQuery({
    ...trpc.projects.getManyAsTranslator.queryOptions({
      translatorId: user.id
    }),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false
  })

  if (isLoading || !data) {
    return <ProjectListSkeleton />
  }

  if (isError) {
    return (
      <div className="text-sm text-red-600">
        {t("error", { message: error.message })}
      </div>
    )
  }

  const projects = data?.projects ? data.projects : []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        {isFetching && (
          <span className="text-xs text-muted-foreground animate-pulse">
            {t("updating")}
          </span>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t("empty")}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectToTranslate
              key={project.project.id}
              projectToTranslate={project}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}
