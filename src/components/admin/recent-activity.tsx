"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FolderKanban } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useTranslations } from "next-intl"

function ActivityShimmer({ length }: { length: number }) {
  return (
    <div className="space-y-4">
      {[...Array(length)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded w-3/4 bg-muted dark:bg-neutral-700" />
            <div className="h-3 rounded w-1/2 bg-muted-foreground/30 dark:bg-neutral-600" />
            <div className="h-3 rounded w-1/3 bg-muted-foreground/20 dark:bg-neutral-700" />
          </div>
          <div className="h-6 w-16 rounded-full bg-muted dark:bg-neutral-700" />
        </div>
      ))}
    </div>
  )
}

interface RecentActivityProps {
  onViewAll?: () => void
}

function formatRelativeTime(d: Date, t: ReturnType<typeof useTranslations>) {
  const diffMs = Date.now() - d.getTime()
  const minutes = Math.floor(diffMs / 60000)

  if (minutes < 1) return t("time.justNow")
  if (minutes < 60) return t("time.minutesAgo", { count: minutes })

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t("time.hoursAgo", { count: hours })

  const days = Math.floor(hours / 24)
  if (days < 7) return t("time.daysAgo", { count: days })

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return t("time.weeksAgo", { count: weeks })

  const months = Math.floor(days / 30)
  if (months < 12) return t("time.monthsAgo", { count: months })

  const years = Math.floor(days / 365)
  return t("time.yearsAgo", { count: years })
}

/** výrazný štítek pro název projektu */
function ProjectBadge({
  name,
  onClick
}: {
  name?: string | null
  onClick?: () => void
}) {
  if (!name) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        border border-primary/30 bg-primary/10 text-primary
        font-medium text-xs leading-none
        shadow-[0_0_0_0_rgba(0,0,0,0)]
        transition
        hover:border-primary/50 hover:bg-primary/15
        hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
        focus:outline-none focus:ring-2 focus:ring-primary/40
      "
      title={name}
    >
      <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="truncate max-w-[16rem]">{name}</span>
    </button>
  )
}

export function RecentActivity({ onViewAll }: RecentActivityProps) {
  const t = useTranslations("RecentActivity")
  const [isHovered, setIsHovered] = useState(false)

  const trpc = useTRPC()
  const { data, isPending } = useQuery(trpc.activity.getRecentActivity.queryOptions())
  const recentActivities = data?.recentActivities

  return (
    <Card
      className="bg-card/50 backdrop-blur-md border-border/50 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle>{t("header.title")}</CardTitle>
        <CardDescription>{t("header.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <ActivityShimmer length={5} />
        ) : (
          <div className="space-y-4">
            {recentActivities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName ?? t("labels.system")}</span>{" "}
                    <span className="text-muted-foreground">{activity.info}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Link href={`/project-view/${activity.projectId}`}>
                      <ProjectBadge name={activity.projectName} />
                    </Link>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                      {t("labels.project")}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(new Date(activity.date), t)}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={
                    activity.activitySeverity === "Success"
                      ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                      : activity.activitySeverity === "Warning"
                      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                      : activity.activitySeverity === "Critical"
                      ? "border-red-700/50 bg-red-700/10 text-red-800 dark:text-red-500"
                      : "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  }
                >
                  {activity.activitySeverity}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {onViewAll && (
          <div
            className={`mt-4 pt-4 border-t border-border/50 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="w-full bg-card/50 backdrop-blur-md border-border/50 text-foreground hover:bg-muted/60 hover:text-foreground group/btn transition-colors"
            >
              {t("actions.viewOtherActivities")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
