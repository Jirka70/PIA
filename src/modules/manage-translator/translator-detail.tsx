"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, CheckCircle2, Clock, XCircle, Edit } from 'lucide-react'
import Link from "next/link"
import { EditLanguagesDialog } from "./edit-languages-dialog"
import { ProjectsList } from "./projects-list"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { TranslatorDetailsShimmer } from "./translator-details-skeleton"
import { ProjectStatusType, ProjectType } from "@/db/schema"
import { usePathname } from "next/navigation"


interface TranslatorDetailProps {
  id: string
}

export default function TranslatorDetailPage({ id } : TranslatorDetailProps) {


  const trpc = useTRPC()

  const { isPending: translatorProjectsPending, data: info } = useQuery(trpc.users.getTranslatorInfo.queryOptions({
    id
  }))


  if (translatorProjectsPending) {
    return <TranslatorDetailsShimmer />
  }

  const translator = info?.translator

  if (!translator) {
    return <p>Translator not found</p>
  }

  const projects = info?.projects || []
  const languages = info?.languages

  const isActive = (status: ProjectStatusType) => {
    return status === "IN_PROGRESS"
      || status === "QA"
      || status === "NEW"
  }

  const isCompleted = (status: ProjectStatusType) => {
    return status === "DONE"
  }

  const isCancelled = (status: ProjectStatusType) => {
    return status === "CLOSED" 
      || status === "BLOCKED"
  }


  const memberSinceDate = new Date(translator.createdAt)
  const formattedDate = memberSinceDate.toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const activeProjects = projects.filter(p => isActive(p.status))
  const completedProjects = projects.filter(p => isCompleted(p.status))
  const cancelledProjects = projects.filter(p => isCancelled(p.status))


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
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">{translator.name}</h1>
                  <p className="text-muted-foreground">{translator.email}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Překladatel od {formattedDate}</span>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dokončené projekty
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">{completedProjects.length}</div>
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
              <div className="text-3xl font-bold text-chart-2">{activeProjects.length}</div>
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
              <div className="text-3xl font-bold text-destructive">{cancelledProjects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Languages Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Jazyky</CardTitle>
                <CardDescription className="mt-1">
                  Jazyky, které překladatel ovládá
                </CardDescription>
              </div>
              <EditLanguagesDialog 
                translatorId={translator.id}
                currentLanguages={languages}
              />
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
            <CardTitle>Active projects ({activeProjects.length})</CardTitle>
            <CardDescription>
              Projekty, na kterých překladatel právě pracuje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={activeProjects}/>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Completed projects ({completedProjects.length})</CardTitle>
            <CardDescription>
              History of completed projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={completedProjects}/>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cancelled projects ({cancelledProjects.length})</CardTitle>
            <CardDescription>
              History of cancelled projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={cancelledProjects}/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
