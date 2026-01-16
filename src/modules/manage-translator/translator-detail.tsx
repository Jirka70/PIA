"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { EditLanguagesDialog } from "./edit-languages-dialog"
import { ProjectsList } from "./projects-list"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { TranslatorDetailsShimmer } from "./translator-details-skeleton"
import { ProjectType } from "@/db/schema"
import UserNotFound from "../error/user-not-found"
import { isActive, isCancelled, isCompleted } from "@/lib/project-status-utils"
import { useTranslations, useLocale } from "next-intl"

interface TranslatorDetailProps {
  id: string
}

export default function TranslatorDetail({ id }: TranslatorDetailProps) {
  const t = useTranslations("TranslatorDetail")
  const locale = useLocale()

  const trpc = useTRPC()
  const { isPending: translatorProjectsPending, data: info } = useQuery(
    trpc.users.getTranslatorInfo.queryOptions({
      id
    })
  )

  if (translatorProjectsPending) {
    return <TranslatorDetailsShimmer />
  }

  const translator = info?.translator

  if (!translator || translator.role !== "translator") {
    return <UserNotFound />
  }

  const projects = info?.projects || []
  const languages = info?.languages ?? []

  const memberSinceDate = new Date(translator.createdAt)
  const formattedDate = memberSinceDate.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  const activeProjects = projects.filter((p) => isActive(p.status))
  const completedProjects = projects.filter((p) => isCompleted(p.status))
  const cancelledProjects = projects.filter((p) => isCancelled(p.status))

  const projectUrl = (project: ProjectType) => `${id}/projects/${project.id}`

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Back button */}
        <Link href="/user-dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("actions.backToDashboard")}
          </Button>
        </Link>

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">{translator.name}</h1>
                  <p className="text-muted-foreground">{translator.email}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{t("profile.memberSince", { date: formattedDate })}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.completed")}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">{completedProjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.active")}</CardTitle>
              <Clock className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">{activeProjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.cancelled")}</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{cancelledProjects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Languages Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("languages.title")}</CardTitle>
                <CardDescription className="mt-1">{t("languages.description")}</CardDescription>
              </div>
              <EditLanguagesDialog translatorId={translator.id} currentLanguages={languages} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <Badge key={language.code} variant="secondary" className="text-sm px-3 py-1">
                  {language.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.activeProjectsTitle", { count: activeProjects.length })}</CardTitle>
            <CardDescription>{t("sections.activeProjectsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={activeProjects} projectUrl={projectUrl} />
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.completedProjectsTitle", { count: completedProjects.length })}</CardTitle>
            <CardDescription>{t("sections.completedProjectsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={completedProjects} projectUrl={projectUrl} />
          </CardContent>
        </Card>

        {/* Cancelled Projects */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.cancelledProjectsTitle", { count: cancelledProjects.length })}</CardTitle>
            <CardDescription>{t("sections.cancelledProjectsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={cancelledProjects} projectUrl={projectUrl} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
