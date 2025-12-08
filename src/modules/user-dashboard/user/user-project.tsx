"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Download, Calendar, CalendarCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { performDownload } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { StatusBadge } from "@/modules/project-view/status-badge"
import { useState } from "react"
import { ReviewDialog } from "./review/review-dialog"
import { CompanyFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { TranslatorReviewCard } from "./review/translator-review-card"
import { CompanyReviewCard } from "./review/company-review-card"
import { UserProjectViewProps } from "@/modules/project-view/project-view-props"
import { ProjectType } from "@/db/schema"
import { ProjectReviewed } from "./project-reviewed"

interface UserProjectProps {
  projectInfo: UserProjectViewProps,
  onTranslatorReviewSubmit: (data: TranslatorFormData, project: ProjectType) => Promise<void>,
  onCompanyReviewSubmit: (data: CompanyFormData, project: ProjectType) => Promise<void>,

}

export const UserProject = ({ projectInfo, onTranslatorReviewSubmit, onCompanyReviewSubmit }: UserProjectProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-emerald-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-amber-500"
    return "bg-slate-400"
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Nenastaveno"
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const project = projectInfo.project;
  const translatorReview = projectInfo.translatorReview
  const companyReview = projectInfo.companyReview
  const sourceFile = projectInfo.sourceFile
  const translatedFile = projectInfo.targetFile;

  const downloadTranslatedFile = async () => {
    if (!translatedFile) {
      throw new Error("Cannot find file to download")
    }


    await performDownload(translatedFile)
  }

  const downloadSourceFile = async () => {
    if (!sourceFile) {
      throw new Error("Cannot find file to download")
    }

    await performDownload(sourceFile);
  }

  const { isPending: isDownloadingTranslatedFile } = useMutation({
    mutationFn: downloadTranslatedFile,
    onError: (error) => {
      toast.error(error.message || "Cannot download translated file right now")
    }
  })

  const { isPending: isDownloadingSourceFile } = useMutation({
    mutationFn: downloadSourceFile,
    onError: (error) => {
      toast.error(error.message || "Cannot download source file right now")
    }
  })

  const hasTranslatorReview = !!translatorReview
  const hasCompanyReview = !!companyReview
  const hasAnyReview = hasTranslatorReview || hasCompanyReview
  const hasAllReviews = hasTranslatorReview && hasCompanyReview

  const getDeadlineColor = (dueDate: Date | string | null | undefined) => {
    if (!dueDate) return "text-foreground"

    const deadline = typeof dueDate === "string" ? new Date(dueDate) : dueDate
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysRemaining < 0) return "text-red-600 dark:text-red-400 font-semibold" // Po deadlinu
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400 font-semibold" // 1-3 dny
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-500 font-semibold" // 4-7 dní
    return "text-foreground"
  }

  const onTranslatorReviewSubmitWrapper = async (data: TranslatorFormData) => {
    await onTranslatorReviewSubmit(data, project);
  }

  const onCompanyReviewSubmitWrapper = async (data: CompanyFormData) => {
    await onCompanyReviewSubmit(data, project)
  }

  const progressColor = getProgressColor(project.progressPercent)

  const isProjectActive = project.status === "QA" || project.status === "NEW" || project.status === "IN_PROGRESS";
  const isProjectClosed = project.status === "CLOSED" || project.status === "BLOCKED";
  

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors truncate">
              {project.name}  
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm sm:text-base line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex-shrink-0 self-start">
            <StatusBadge status={project.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasAllReviews && (
          <ProjectReviewed />
        )}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Progress</span>
            </div>
            <span className="font-bold text-base tabular-nums">{project.progressPercent}%</span>
          </div>

          <div className="relative w-full bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`${progressColor} rounded-full h-full transition-all duration-500 ease-out relative overflow-hidden`}
              style={{ width: `${project.progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Vytvořeno</span>
              <span className="font-medium truncate">{formatDate(project.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CalendarCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Deadline</span>
              <span className={`font-medium truncate ${getDeadlineColor(project.dueAt)}`}>
                {formatDate(project.dueAt)}
              </span>
            </div>
          </div>
        </div>

        {hasAnyReview && (
          <div className="pt-4 border-t border-border/50 space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Recenze
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {hasTranslatorReview  && (
                <TranslatorReviewCard translatorReview={translatorReview} />
              )}
              {hasCompanyReview  && <CompanyReviewCard companyReview={companyReview} />}
            </div>
          </div>
        )}

        {(sourceFile || translatedFile) && (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-border/50">
            {sourceFile && (
              <Button variant="outline" disabled={isDownloadingSourceFile} size="sm" onClick={async () => { await downloadSourceFile()}}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloadingSourceFile ? "Getting Source File" : "Download Source File"}
              </Button>
            )}
            {translatedFile && (
              <Button variant="default" size="sm" disabled={isDownloadingTranslatedFile} onClick={async () => { downloadTranslatedFile() }}className="flex min-w-[140px] gap-2">


                  <Download className="w-4 h-4" />
                  {isDownloadingTranslatedFile ? "Getting translated file" : "Translated file"}
              </Button>
            )}
            {project.status === "DONE" && (
              <ReviewDialog
                isOpen={isReviewDialogOpen}
                onOpenChange={setIsReviewDialogOpen}
                onTranslatorReviewSubmitted={onTranslatorReviewSubmitWrapper}
                onCompanyReviewSubmitted={onCompanyReviewSubmitWrapper}
                isTranslatorReviewSubmitted={!!hasTranslatorReview}
                isCompanyReviewSubmitted={!!hasCompanyReview}
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xs font-medium text-muted-foreground">
            {(project.progressPercent < 100 && !isProjectClosed) && <span> {100 - project.progressPercent}% remaining</span>}
            {(project.progressPercent === 100 && isProjectActive) &&  <span>Waiting for review</span>}
            {(project.progressPercent === 100 && project.status === "DONE" && <span className="text-emerald-600 dark:text-emerald-400">✓ Complete</span>)}
            {isProjectClosed && <span className="text-red-600 dark:text-red-400">✗ Closed</span>}
          </div>
        </div>
      </CardContent>
      
    </Card>
  )
}
