"use client"

import { Card } from "@/components/ui/card"
import { ProjectHeader } from "./project-header"
import { getDaysUntilDue } from "./utils/date"
import { useState, useMemo } from "react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Hourglass, BadgeCheck, AlertTriangle, ThumbsUp, ThumbsDown, ShieldAlert, Siren } from "lucide-react"

type AcceptState = "n/a" | "waiting for approval" | "accepted" | "rejected"

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

  const acceptState = (project.acceptState ?? "n/a") as AcceptState
  const shouldShowAcceptState = acceptState !== "n/a"

  const isDoneWithoutApproval =
    project.status === "DONE" && acceptState !== "accepted" // includes waiting/rejected/n/a

  const acceptUi = useMemo(() => {
    // If DONE without customer approval, show a stronger admin warning panel instead of normal accept-state info.
    if (isDoneWithoutApproval) {
      return {
        icon: Siren,
        title: "Projekt byl ukončen bez schválení zákazníka",
        description:
          "Projekt je ve stavu DONE, ale zákazník jej neakceptoval. To může znamenat procesní výjimku (force close) nebo nedokončenou QA smyčku. Doporučení: ověřte auditní stopu změny statusu, zkontrolujte komunikaci se zákazníkem a případně projekt znovu otevřete (QA / IN_PROGRESS) dle interních pravidel.",
        badgeVariant: "destructive" as const,
        badgeIcon: ShieldAlert,
        containerClass: "border-red-500/40 bg-red-500/10"
      }
    }

    if (!shouldShowAcceptState) return null

    if (acceptState === "waiting for approval") {
      return {
        icon: Hourglass,
        title: "Čeká se na schválení zákazníkem",
        description:
          "Projekt je připraven k zákaznickému hodnocení. Po rozhodnutí zákazníka se stav automaticky promítne zde i do dalších pohledů.",
        badgeVariant: "secondary" as const,
        badgeIcon: Info,
        containerClass: "border-primary/30 bg-primary/5"
      }
    }

    if (acceptState === "accepted") {
      return {
        icon: BadgeCheck,
        title: "Zákazník schválil výstup",
        description:
          "Projekt byl zákazníkem akceptován. Administrativně můžete ověřit, že byly splněny interní kroky (fakturace, uzavření, archivace souborů).",
        badgeVariant: "default" as const,
        badgeIcon: ThumbsUp,
        containerClass: "border-emerald-500/30 bg-emerald-500/5"
      }
    }

    // rejected
    return {
      icon: AlertTriangle,
      title: "Zákazník zamítl výstup",
      description:
        "Projekt byl zamítnut. Doporučení: zkontrolujte komentáře/review, případně iniciujte komunikaci mezi zákazníkem a překladatelem pro rychlé doplnění požadavků.",
      badgeVariant: "destructive" as const,
      badgeIcon: ThumbsDown,
      containerClass: "border-red-500/30 bg-red-500/5"
    }
  }, [acceptState, shouldShowAcceptState, isDoneWithoutApproval])

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
    <Card className={isOverdue ? "border-red-500/50 shadow-lg" : isUrgent ? "border-yellow-500/50 shadow-lg" : ""}>
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
        {/* AcceptState / DONE-without-approval panel */}
        {acceptUi && (
          <>
            <Alert className={acceptUi.containerClass}>
              <AlertTitle className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <acceptUi.icon className="h-4 w-4" />
                  <span>{acceptUi.title}</span>
                </div>
              </AlertTitle>

              <AlertDescription className="mt-2 space-y-3">
                <p className="text-sm text-muted-foreground">{acceptUi.description}</p>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    {isDoneWithoutApproval
                      ? "Poznámka: tento stav by měl být výjimečný. Pokud je to neúmyslné, doporučujeme projekt znovu otevřít a dokončit QA/approval proces."
                      : "Administrativní poznámka: tento stav je odvozen ze zákaznického rozhodnutí."}
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Separator />
          </>
        )}

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
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">{t("reviews.title")}</h4>
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
