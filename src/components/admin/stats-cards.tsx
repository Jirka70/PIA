"use client"

import { CheckCircle2, Clock, FileText, Users } from "lucide-react"
import { StatsCard, StatsCardSkeleton } from "./stats-card"

interface UserStats {
  totalUsers: number,
  usersLastMonth: number,
  translators: number,
  normalUsers: number
}

interface ActiveProjects {
  total: number,
  lastMonth: number
}

interface CompletedProjects {
  count: number
}

interface TotalProjects {
  total: number,
  lastMonth: number
}

interface StatsProps {
  userStats?: UserStats,
  activeProjects?: ActiveProjects,
  completedProjects?: CompletedProjects
  totalProjects?: TotalProjects
}



export function StatsCards({ userStats, activeProjects, completedProjects, totalProjects } : StatsProps) {

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {userStats ? (
        <StatsCard
          title="Total Users"
          value={userStats.totalUsers}
          change={`+${(userStats.usersLastMonth / userStats.totalUsers) * 100} % Last month`}
          description={`${userStats.translators} Translators, ${userStats.normalUsers} Customers`}
          changeType={(userStats.usersLastMonth / userStats.totalUsers) >= 0 ? "positive" : "negative"}
          icon={Users}
        />
      ) : (
        <StatsCardSkeleton />
      )}
      {activeProjects ? (
        <StatsCard
          title="Active Projects"
          value={activeProjects.total}
          change={`+${(activeProjects.lastMonth / activeProjects.total) * 100} % Last Month`}
          description={`Currently in progress`}
          changeType={"positive"}
          icon={Clock}
        />
      ) : (
        <StatsCardSkeleton />
      )}
      {completedProjects ? (
        <StatsCard
          title="Completed Projects"
          value={completedProjects.count}
          change={``}
          description={``}
          changeType={"positive"}
          icon={CheckCircle2}
        />
      ) : (
        <StatsCardSkeleton />
      )}
      {totalProjects ? (
        <StatsCard
          title="Total Projects"
          value={totalProjects.total}
          change={`+${(totalProjects.lastMonth / totalProjects.total) * 100} % Last month`}
          description={``}
          changeType={"positive"}
          icon={FileText}
        />
      ) : (
        <StatsCardSkeleton />
      )}
    </div>
  )
}
