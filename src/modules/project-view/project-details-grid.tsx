"use client"

import React from "react"
import { Languages, Calendar, Building2, UserIcon, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "./utils/date"
import { CompanyReviewType, ProjectFileType, ProjectType, TranslatorReviewType } from "@/db/schema"
import { useTranslations } from "next-intl"

export interface ProjectGridProps {
  project: ProjectType
  clientName?: string
  clientEmail?: string
  translatorName?: string
  translatorEmail?: string
  sourceFile: ProjectFileType | null
  translatedFile?: ProjectFileType | null
  translatorReview?: TranslatorReviewType | null
  companyReview?: CompanyReviewType | null
  onClientClick?: (clientId: string) => void
  onTranslatorClick?: (translatorId: string) => void
}

export function ProjectDetailsGrid({
  project,
  clientName,
  clientEmail,
  translatorName,
  translatorEmail,
  onClientClick,
  onTranslatorClick
}: ProjectGridProps) {
  const t = useTranslations("ProjectDetailsGrid")

  const daysUntilDue = ((): number | null => {
    if (!project.dueAt) return null
    const now = new Date()
    const due = new Date(project.dueAt)
    const diffTime = due.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })()

  const isOverdue = daysUntilDue !== null && daysUntilDue < 0
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
  const isClientInteractive = !!onClientClick && !!project.clientId
  const isTranslatorInteractive = !!onTranslatorClick && !!project.translatorId

  const dueLine = () => {
    if (daysUntilDue === null) return null
    if (isOverdue) return t("due.daysOverdue", { count: Math.abs(daysUntilDue) })
    if (daysUntilDue === 1) return t("due.daysRemaining", { count: daysUntilDue })
    return t("due.daysRemainingPlural", { count: daysUntilDue })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem icon={<Languages className="h-4 w-4" />} label={t("labels.languages")}>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-base font-semibold">
            {project.sourceLanguage.toUpperCase()}
          </Badge>
          <span className="text-muted-foreground">→</span>
          <Badge variant="secondary" className="text-base font-semibold">
            {project.targetLanguage.toUpperCase()}
          </Badge>
        </div>
      </InfoItem>

      <InfoItem icon={<Calendar className="h-4 w-4" />} label={t("labels.dueDate")}>
        <div className="flex flex-col gap-1">
          <span
            className={
              isOverdue
                ? "text-red-500 font-semibold"
                : isUrgent
                ? "text-yellow-500 font-semibold"
                : "text-foreground"
            }
          >
            {formatDate(project.dueAt)}
          </span>

          {dueLine() && <span className="text-xs text-muted-foreground">{dueLine()}</span>}
        </div>
      </InfoItem>

      <InfoItem icon={<Building2 className="h-4 w-4" />} label={t("labels.client")}>
        <div className="flex flex-col gap-1">
          {project.clientId ? (
            isClientInteractive ? (
              <button
                type="button"
                className="flex flex-col gap-1 text-left rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => onClientClick?.(project.clientId!)}
              >
                <span className="font-medium underline-offset-2 hover:underline">{clientName}</span>
                <span className="text-sm text-muted-foreground">{clientEmail}</span>
              </button>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="font-medium">{clientName}</span>
                <span className="text-sm text-muted-foreground">{clientEmail}</span>
              </div>
            )
          ) : (
            <span className="text-sm text-muted-foreground italic">{t("states.notAssigned")}</span>
          )}
        </div>
      </InfoItem>

      <InfoItem icon={<UserIcon className="h-4 w-4" />} label={t("labels.translator")}>
        <div className="flex flex-col gap-1">
          {project.translatorId ? (
            isTranslatorInteractive ? (
              <button
                type="button"
                className="flex flex-col gap-1 text-left rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => onTranslatorClick?.(project.translatorId!)}
              >
                <span className="font-medium underline-offset-2 hover:underline">{translatorName}</span>
                <span className="text-sm text-muted-foreground">{translatorEmail}</span>
              </button>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="font-medium">{translatorName}</span>
                <span className="text-sm text-muted-foreground">{translatorEmail}</span>
              </div>
            )
          ) : (
            <span className="text-sm text-muted-foreground italic">{t("states.notAssigned")}</span>
          )}
        </div>
      </InfoItem>

      <InfoItem icon={<Clock className="h-4 w-4" />} label={t("labels.created")}>
        <span className="text-sm">{formatDate(project.createdAt)}</span>
      </InfoItem>

      <InfoItem icon={<Clock className="h-4 w-4" />} label={t("labels.lastUpdated")}>
        <span className="text-sm">{formatDate(project.updatedAt)}</span>
      </InfoItem>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  children
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}
