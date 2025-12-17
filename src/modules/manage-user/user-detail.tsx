"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  User,
} from "lucide-react"

import { useTRPC } from "@/trpc/client"
import { ProjectStatusType, ProjectType } from "@/db/schema"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TranslatorDetailsShimmer } from "../manage-translator/translator-details-skeleton"
import UserNotFound from "../error/user-not-found"
import { ProjectsList } from "../manage-translator/projects-list"
import { isActive, isCancelled, isCompleted } from "@/lib/project-status-utils"

interface CustomerDetailProps {
  id: string
}

export default function UserDetail({ id }: CustomerDetailProps) {
  const trpc = useTRPC()

  const { isPending, data: info } = useQuery(
    trpc.users.getUserInfo.queryOptions({ id })
  )

  if (isPending) {
    return <TranslatorDetailsShimmer />
  }

  const user = info?.user
  if (!user || user.role !== "user") {
    return <UserNotFound />
  }

  const projects = info?.projects ?? []

  const memberSinceDate = new Date(user.createdAt)
  const formattedDate = memberSinceDate.toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const activeProjects = projects.filter((p) => isActive(p.status))
  const completedProjects = projects.filter((p) => isCompleted(p.status))
  const cancelledProjects = projects.filter((p) => isCancelled(p.status))

  const projectUrl = (project: ProjectType) =>
    `/admin/user/${id}/projects/${project.id}`

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Back button */}
        <Link href="/user-dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back To Dashboard
          </Button>
        </Link>

        {/* Profile Header */}
        <Card>
          <CardContent >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.name}
                  </h1>

                  {/* Označení typu profilu */}
                  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    User
                  </span>
                </div>

                <p className="text-muted-foreground">{user.email}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Uživatel od {formattedDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dokončené projekty
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">
                {completedProjects.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aktivní projekty
              </CardTitle>
              <Clock className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">
                {activeProjects.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Zrušené projekty
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {cancelledProjects.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projekty */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivní projekty ({activeProjects.length})</CardTitle>
            <CardDescription>Projekty ve zpracování</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList
              projects={activeProjects}
              projectUrl={projectUrl}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Dokončené projekty ({completedProjects.length})
            </CardTitle>
            <CardDescription>
              Historie dokončených projektů
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList
              projects={completedProjects}
              projectUrl={projectUrl}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Zrušené projekty ({cancelledProjects.length})
            </CardTitle>
            <CardDescription>
              Historie zrušených projektů
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList
              projects={cancelledProjects}
              projectUrl={projectUrl}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
