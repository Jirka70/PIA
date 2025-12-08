"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, FileText, Plus } from "lucide-react"
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
import { Row } from "react-day-picker"

interface UserDashboardProps {
  user: User
}

const StatisticsShimmer = () => {
  return (
    <Skeleton className="h-5 w-[22px] pb-2" />
  )
}

export const UserDashboard = ({ user } : UserDashboardProps) => {

    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const { data: projectsInfo, isLoading, isError, isFetching, error } = useQuery({
        ...trpc.projects.getManyAsUser.queryOptions({
            userId: user.id,
        }),
        
        staleTime: 60_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: false,
    });

    if (isError) {
        return (
            <div className="text-sm text-red-600">
                Projects could not be loaded: {error.message}
            </div>
        );
    }

    const { data: lastMonthProjects } = useQuery(trpc.projects.getProjectsCreatedLastMonth.queryOptions({
      id: user.id
    }));

    const { mutateAsync: publishTranslatorReviewAsync } = useMutation(trpc.reviews.publishTranslatorReview.mutationOptions({
        onSuccess: () => {
          toast.success(`Review was successfully posted for project`)
        },
    
        onError: (error) => {
          toast.error(error?.message || `Review cannot be currently posted for project`)
        }
      }))

    const projects = projectsInfo?.projects;

    const { mutateAsync: publishCompanyReviewAsync } = useMutation(trpc.reviews.publishCompanyReview.mutationOptions({
      onSuccess: () => {
        toast.success("Review was successfully posted for project")
      },
      onError: (error) => {
        toast.error(error?.message || "Review cannot be currently posted for project")
      }
    }))


    const activeProjectsLength = projects?.filter((e) => e.project.status === "NEW" || e.project.status === "IN_PROGRESS" || e.project.status === "QA").length
    const inProgressProjectsLength = projects?.filter((e) => e.project.status === "IN_PROGRESS").length
    const completedProjectsLength = projects?.filter((e) => e.project.status === "DONE").length
    const pendingReviewProjectsLength = projects?.filter((e) => e.project.status === "QA").length

    const activeLastMonthProjectsLength = lastMonthProjects?.projects.filter((e) => e.status === "NEW" || e.status === "IN_PROGRESS" || e.status === "QA").length


    const onTranslatorReviewSubmit = async (data: TranslatorFormData, project: ProjectType) => {
      const { translatorReview } = await publishTranslatorReviewAsync({
        projectId: project.id,
        reviewData: data
      })

      if (!translatorReview) {
        // error was handled already in the trpc procedure
        return;
      }

      queryClient.setQueryData(
        trpc.projects.getManyAsUser.queryKey({ userId: user.id }),
        (cached) => {
          if (!cached) return cached
          return {
            ...cached,
            projects: cached.projects.map((row) => row.project.id === project.id 
              ? {...row, translatorReview }
              : row 
              )
          }
        }
      )
    }

    const onCompanyReviewSubmit = async (data: CompanyFormData, project: ProjectType) => {
      const { companyReview } = await publishCompanyReviewAsync({
        projectId: project.id,
        reviewData: data
      })

      if (!companyReview) {
        return;
      }

      queryClient.setQueryData(
        trpc.projects.getManyAsUser.queryKey({ userId: user.id }),
        (cached) => {
          if (!cached) return cached
          return {
            ...cached,
            projects: cached.projects.map((row) => row.project.id === project.id 
              ? {...row, companyReview }
              : row 
              )
          }
        }
      )
    }

    

    return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your translation projects and track progress</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects ? <StatisticsShimmer /> : activeProjectsLength}</div>
              <p className="text-xs text-muted-foreground">{lastMonthProjects && `+${activeLastMonthProjectsLength} Last Month`}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects ? <StatisticsShimmer /> : inProgressProjectsLength}</div>
              <p className="text-xs text-muted-foreground">Being translated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects ? <StatisticsShimmer /> : completedProjectsLength}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects ? <StatisticsShimmer /> : pendingReviewProjectsLength}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <NewProjectDialog user={user}/>
        </div>
        {isLoading  || !projects
          ? <ProjectListSkeleton /> 
          : <UserProjectsContent 
              projects={projects} 
              isFetching={isFetching}
              onTranslatorReviewSubmit={onTranslatorReviewSubmit}
              onCompanyReviewSubmit={onCompanyReviewSubmit}
            />
        }       
      </div>
    </div>
  )
}
