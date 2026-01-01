"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react"
import { NewProjectDialog } from "./new-project-dialog"
import { User } from "better-auth"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserProjectsContent } from "./user-projects-content"
import { ProjectListSkeleton } from "../project-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { CompanyFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { ProjectType } from "@/db/schema"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

interface UserDashboardProps {
  user: User
}

const StatisticsShimmer = () => {
  return <Skeleton className="h-5 w-[22px] pb-2" />
}

export const UserDashboard = ({ user }: UserDashboardProps) => {
  const t = useTranslations("UserDashboard")

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const {
    data: projectsInfo,
    isLoading,
    isError,
    isFetching,
    error
  } = useQuery({
    ...trpc.projects.getManyAsUser.queryOptions({
      userId: user.id
    }),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false
  })

  const { data: lastMonthProjects } = useQuery(
    trpc.projects.getProjectsCreatedLastMonth.queryOptions({
      id: user.id
    })
  )

  const { mutateAsync: publishTranslatorReviewAsync } = useMutation(
    trpc.reviews.publishTranslatorReview.mutationOptions({
      onSuccess: () => {
        toast.success(t("toast.reviewPosted"))
      },
      onError: (error) => {
        toast.error(error?.message || t("toast.reviewCannotBePosted"))
      }
    })
  )

  const { mutateAsync: publishCompanyReviewAsync } = useMutation(
    trpc.reviews.publishCompanyReview.mutationOptions({
      onSuccess: () => {
        toast.success(t("toast.reviewPosted"))
      },
      onError: (error) => {
        toast.error(error?.message || t("toast.reviewCannotBePosted"))
      }
    })
  )

  const projects = projectsInfo?.projects

  const activeProjectsLength = projects?.filter(
    (e) => e.project.status === "NEW" || e.project.status === "IN_PROGRESS" || e.project.status === "QA"
  ).length

  const inProgressProjectsLength = projects?.filter((e) => e.project.status === "IN_PROGRESS").length
  const completedProjectsLength = projects?.filter((e) => e.project.status === "DONE").length
  const pendingReviewProjectsLength = projects?.filter((e) => e.project.status === "QA").length

  const activeLastMonthProjectsLength = lastMonthProjects?.projects.filter(
    (e) => e.status === "NEW" || e.status === "IN_PROGRESS" || e.status === "QA"
  ).length

  const onTranslatorReviewSubmit = async (data: TranslatorFormData, project: ProjectType) => {
    const { translatorReview } = await publishTranslatorReviewAsync({
      projectId: project.id,
      reviewData: data
    })

    if (!translatorReview) return

    queryClient.setQueryData(trpc.projects.getManyAsUser.queryKey({ userId: user.id }), (cached) => {
      if (!cached) return cached
      return {
        ...cached,
        projects: cached.projects.map((row) => (row.project.id === project.id ? { ...row, translatorReview } : row))
      }
    })
  }

  const onCompanyReviewSubmit = async (data: CompanyFormData, project: ProjectType) => {
    const { companyReview } = await publishCompanyReviewAsync({
      projectId: project.id,
      reviewData: data
    })

    if (!companyReview) return

    queryClient.setQueryData(trpc.projects.getManyAsUser.queryKey({ userId: user.id }), (cached) => {
      if (!cached) return cached
      return {
        ...cached,
        projects: cached.projects.map((row) => (row.project.id === project.id ? { ...row, companyReview } : row))
      }
    })
  }

  if (isError) {
    return <div className="text-sm text-red-600">{t("errors.projectsCouldNotBeLoaded")}</div>
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t("header.welcome", { name: user.name })}
          </h1>
          <p className="text-muted-foreground">{t("header.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.activeProjects")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || !projects ? <StatisticsShimmer /> : activeProjectsLength}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastMonthProjects && typeof activeLastMonthProjectsLength === "number"
                  ? t("stats.activeLastMonth", { count: activeLastMonthProjectsLength })
                  : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.inProgress")}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || !projects ? <StatisticsShimmer /> : inProgressProjectsLength}
              </div>
              <p className="text-xs text-muted-foreground">{t("stats.beingTranslated")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.completed")}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || !projects ? <StatisticsShimmer /> : completedProjectsLength}
              </div>
              <p className="text-xs text-muted-foreground">{t("stats.totalCompleted")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.pendingReview")}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || !projects ? <StatisticsShimmer /> : pendingReviewProjectsLength}
              </div>
              <p className="text-xs text-muted-foreground">{t("stats.awaitingApproval")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("projects.title")}</h2>
          <NewProjectDialog user={user} />
        </div>

        {isLoading || !projects ? (
          <ProjectListSkeleton />
        ) : (
          <UserProjectsContent
            projects={projects}
            isFetching={isFetching}
            onTranslatorReviewSubmit={onTranslatorReviewSubmit}
            onCompanyReviewSubmit={onCompanyReviewSubmit}
          />
        )}
      </div>
    </div>
  )
}
