"use client"

import { CheckCircle2, Clock, FileText, Users } from "lucide-react"
import { StatsCard, StatsCardSkeleton } from "./stats-card"
import { useTranslations } from "next-intl"

interface UserStats {
  totalUsers: number
  usersLastMonth: number
  translators: number
  normalUsers: number
}

interface ActiveProjects {
  total: number
  lastMonth: number
}

interface CompletedProjects {
  count: number
}

interface TotalProjects {
  total: number
  lastMonth: number
}

interface StatsProps {
  userStats?: UserStats
  activeProjects?: ActiveProjects
  completedProjects?: CompletedProjects
  totalProjects?: TotalProjects
}

function getPercent(lastMonth: number, total: number): number {
  if (!total) return 0
  return (lastMonth / total) * 100
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0.0"
  return value.toFixed(1)
}

export function StatsCards({
  userStats,
  activeProjects,
  completedProjects,
  totalProjects
}: StatsProps) {
  const t = useTranslations("StatsCards")

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {userStats ? (
        <StatsCard
          title={t("totalUsers.title")}
          value={userStats.totalUsers}
          change={`+${t("change.lastMonth", {
            value: formatPercent(getPercent(userStats.usersLastMonth, userStats.totalUsers))
          })}`}
          description={t("totalUsers.description", {
            translators: userStats.translators,
            customers: userStats.normalUsers
          })}
          changeType={getPercent(userStats.usersLastMonth, userStats.totalUsers) >= 0 ? "positive" : "negative"}
          icon={Users}
        />
      ) : (
        <StatsCardSkeleton />
      )}

      {activeProjects ? (
        <StatsCard
          title={t("activeProjects.title")}
          value={activeProjects.total}
          change={`+${t("change.lastMonth", {
            value: formatPercent(getPercent(activeProjects.lastMonth, activeProjects.total))
          })}`}
          description={t("activeProjects.description")}
          changeType="positive"
          icon={Clock}
        />
      ) : (
        <StatsCardSkeleton />
      )}

      {completedProjects ? (
        <StatsCard
          title={t("completedProjects.title")}
          value={completedProjects.count}
          change=""
          description={t("completedProjects.description")}
          changeType="positive"
          icon={CheckCircle2}
        />
      ) : (
        <StatsCardSkeleton />
      )}

      {totalProjects ? (
        <StatsCard
          title={t("totalProjects.title")}
          value={totalProjects.total}
          change={`+${t("change.lastMonth", {
            value: formatPercent(getPercent(totalProjects.lastMonth, totalProjects.total))
          })}`}
          description={t("totalProjects.description")}
          changeType="positive"
          icon={FileText}
        />
      ) : (
        <StatsCardSkeleton />
      )}
    </div>
  )
}
