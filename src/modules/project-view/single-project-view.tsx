"use client"

import { Card } from "@/components/ui/card"
import { ProjectHeader } from "./project-header"
import { getDaysUntilDue } from "./utils/date"
import { useState } from "react"
import { ProjectDetailsGrid } from "./project-details-grid"
import { Separator } from "@/components/ui/separator"
import { ProgressSection } from "./progress-section"
import { FilesSection } from "./files-section"
import { toast } from "sonner"
import { performDownload, performPreview } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { SingleProjectViewProps } from "./project-view-props"
import { TranslatorReviewCard } from "@/modules/user-dashboard/user/review/translator-review-card"
import { CompanyReviewCard } from "@/modules/user-dashboard/user/review/company-review-card"
import { useTranslations } from "next-intl"

export const SingleProjectView = ({
  project,
  clientName,
  clientEmail,
  translatorName,
  translatorEmail,
  sourceFile,
  translatedFile,
  translatorReview,
  companyReview,
  isStatusUpdating,
  onStatusUpdate,
  onClientClick,
  onTranslatorClick,
  availableStatuses
}: SingleProjectViewProps) => {
  const t = useTranslations("SingleProjectView")
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)

  const trpc = useTRPC()

  const { isPending: isSourceFilePending, mutateAsync: getSourceFileAsync } = useMutation(
    trpc.projects.getSourceProjectFile.mutationOptions({
      onError: (error) => {
        toast.error(error.message ?? t("toasts.cannotObtainSourceFile"))
      }
    })
  )

  const { isPending: isTranslatedFilePending, mutateAsync: getTranslatedFileAsync } = useMutation(
    trpc.projects.getTranslatedFile.mutationOptions({
      onError: (error) => {
        toast.error(error.message ?? t("toasts.cannotObtainTranslatedFile"))
      }
    })
  )

  const daysUntilDue = getDaysUntilDue(project.dueAt)
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0
  const hasTranslatorReview = !!translatorReview
  const hasCompanyReview = !!companyReview
  const hasAnyReview = hasTranslatorReview || hasCompanyReview

  async function handleViewSourceFile() {
    toast.info(t("toasts.gettingFileToView"))
    const srcFile = await getSourceFileAsync({ projectId: project.id })
    if (srcFile.projectFile.fileName.toLocaleLowerCase().endsWith(".docx")) {
      toast.warning(t("toasts.docxCannotPreviewPreparingDownload"))
    }
    await performPreview(srcFile.projectFile)
  }

  async function handleDownloadSourceFile() {
    toast.info(t("toasts.gettingFileToDownload"))
    const srcFile = await getSourceFileAsync({ projectId: project.id })
    await performDownload(srcFile.projectFile)
  }

  async function handleViewTranslatedFile() {
    toast.info(t("toasts.gettingFileToView"))
    const translatedFile = await getTranslatedFileAsync({ projectId: project.id })
    if (translatedFile.translatedFile.fileName.toLocaleLowerCase().endsWith(".docx")) {
      toast.warning(t("toasts.docxCannotPreviewPreparingDownload"))
    }
    await performPreview(translatedFile.translatedFile)
  }

  async function handleDownloadTranslatedFile() {
    toast.info(t("toasts.gettingFileToDownload"))
    const translatedFile = await getTranslatedFileAsync({ projectId: project.id })
    await performDownload(translatedFile.translatedFile)
  }

  return (
    <Card
      className={
        isOverdue ? "border-red-500/50 shadow-lg" : isUrgent ? "border-yellow-500/50 shadow-lg" : ""
      }
    >
      <ProjectHeader
        project={project}
        isOverdue={isOverdue}
        isUrgent={isUrgent}
        isStatusDialogOpen={isStatusDialogOpen}
        setIsStatusDialogOpen={setIsStatusDialogOpen}
        onStatusUpdate={onStatusUpdate}
        isStatusUpdating={isStatusUpdating}
        availableStatuses={availableStatuses}
      />

      <div className="space-y-6 px-6 pb-6">
        <ProjectDetailsGrid
          project={project}
          clientName={clientName}
          clientEmail={clientEmail}
          translatorName={translatorName}
          translatorEmail={translatorEmail}
          translatedFile={translatedFile}
          sourceFile={sourceFile}
          onClientClick={onClientClick}
          onTranslatorClick={onTranslatorClick}
        />

        <Separator />

        <ProgressSection progressPercent={project.progressPercent} progressNote={project.progressNote} />

        <Separator />

        {hasAnyReview && (
          <>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                {t("reviews.title")}
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {hasTranslatorReview && translatorReview && <TranslatorReviewCard translatorReview={translatorReview} />}
                {hasCompanyReview && companyReview && <CompanyReviewCard companyReview={companyReview} />}
              </div>
            </div>
            <Separator />
          </>
        )}

        <FilesSection
          hasSourceFile={!!sourceFile}
          hasTranslatedFile={!!translatedFile}
          onViewSource={handleViewSourceFile}
          onDownloadSource={handleDownloadSourceFile}
          onViewTranslated={handleViewTranslatedFile}
          onDownloadTranslated={handleDownloadTranslatedFile}
          isSourceLoading={isSourceFilePending}
          isTranslatedLoading={isTranslatedFilePending}
        />
      </div>
    </Card>
  )
}
