"use client"

import { Languages, Calendar, Building2, UserIcon, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "./utils/date"
import { SingleProjectViewProps } from "./project-view-props"
import { CompanyReviewType, ProjectFileType, ProjectType, TranslatorReviewType } from "@/db/schema"

export interface ProjectGridProps {
    project: ProjectType,
    clientName?: string,
    clientEmail?: string,
    translatorName?: string,
    translatorEmail?: string,
    sourceFile: ProjectFileType | null,
    translatedFile?: ProjectFileType | null,
    translatorReview?: TranslatorReviewType | null,
    companyReview?: CompanyReviewType | null,
}

export function ProjectDetailsGrid({ project, clientName, clientEmail, translatorName, translatorEmail } : ProjectGridProps) {
  const daysUntilDue = ((): number | null => {
    if (!project.dueAt) return null
    const now = new Date()
    const due = new Date(project.dueAt)
    const diffTime = due.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })()

  const isOverdue = daysUntilDue !== null && daysUntilDue < 0
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem icon={<Languages className="h-4 w-4" />} label="Languages">
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

      <InfoItem icon={<Calendar className="h-4 w-4" />} label="Due Date">
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
          {daysUntilDue !== null && (
            <span className="text-xs text-muted-foreground">
              {isOverdue
                ? `${Math.abs(daysUntilDue)} days overdue`
                : `${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""} remaining`}
            </span>
          )}
        </div>
      </InfoItem>

      <InfoItem icon={<Building2 className="h-4 w-4" />} label="Client">
        <div className="flex flex-col gap-1">
          {project.clientId ? (
            <>
              <span className="font-medium">{clientName}</span>
              <span className="text-sm text-muted-foreground">{clientEmail}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Not assigned
            </span>
          )}
        </div>
      </InfoItem>

      <InfoItem icon={<UserIcon className="h-4 w-4" />} label="Translator">
        <div className="flex flex-col gap-1">
          {project.translatorId ? (
            <>
              <span className="font-medium">{translatorName}</span>
              <span className="text-sm text-muted-foreground">
                {translatorEmail}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Not assigned
            </span>
          )}
        </div>
      </InfoItem>

      <InfoItem icon={<Clock className="h-4 w-4" />} label="Created">
        <span className="text-sm">{formatDate(project.createdAt)}</span>
      </InfoItem>

      <InfoItem icon={<Clock className="h-4 w-4" />} label="Last Updated">
        <span className="text-sm">{formatDate(project.updatedAt)}</span>
      </InfoItem>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  children,
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