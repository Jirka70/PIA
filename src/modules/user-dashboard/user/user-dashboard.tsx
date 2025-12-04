"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, FileText, Plus } from "lucide-react"
import { NewProjectDialog } from "./new-project-dialog"
import { User } from "better-auth"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { UserProjectsContent } from "./user-projects-content"
import { ProjectListSkeleton } from "../project-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

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
    const { data: projects, isLoading, isError, isFetching, error } = useQuery({
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


    const activeProjectsLength = projects?.projects.filter((e) => e.status === "NEW" || e.status === "IN_PROGRESS" || e.status === "QA").length
    const inProgressProjectsLength = projects?.projects.filter((e) => e.status === "IN_PROGRESS").length
    const completedProjectsLength = projects?.projects.filter((e) => e.status === "DONE").length
    const pendingReviewProjectsLength = projects?.projects.filter((e) => e.status === "QA").length

    const activeLastMonthProjectsLength = lastMonthProjects?.projects.filter((e) => e.status === "NEW" || e.status === "IN_PROGRESS" || e.status === "QA").length
    

    

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
              <div className="text-2xl font-bold">{isLoading || !projects?.projects ? <StatisticsShimmer /> : activeProjectsLength}</div>
              <p className="text-xs text-muted-foreground">{lastMonthProjects && `+${activeLastMonthProjectsLength} Last Month`}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects?.projects ? <StatisticsShimmer /> : inProgressProjectsLength}</div>
              <p className="text-xs text-muted-foreground">Being translated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects?.projects ? <StatisticsShimmer /> : completedProjectsLength}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading || !projects?.projects ? <StatisticsShimmer /> : pendingReviewProjectsLength}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <NewProjectDialog user={user}/>
        </div>
        {isLoading  || !projects?.projects
          ? <ProjectListSkeleton /> 
          : <UserProjectsContent projects={projects.projects} isFetching={isFetching} />
        }       
      </div>
    </div>
  )
}