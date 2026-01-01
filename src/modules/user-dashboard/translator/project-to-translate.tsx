"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CompanyReviewType, ProjectFileType, ProjectType, TranslatorReviewType, user } from "@/db/schema"
import { performDownload, performPreview } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Calendar,
  Clock,
  Languages,
  Eye,
  Download,
  ThumbsUp,
  ThumbsDown,
  Hourglass,
  ShieldCheck,
  BadgeCheck,
  AlertTriangle
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { UploadTranslatedFileDialog } from "./upload-translated-file-dialog"
import { User } from "better-auth"
import { ChatDialog } from "../chat/chat-dialog"
import { StatusBadge } from "@/modules/project-view/status-badge"
import { ProjectStatusDialog } from "./status-dialog"
import { QAStatusDialog } from "./qa-dialog"
import { ProgressDialog } from "./progress-dialog"
import { ConfirmProgressDialog, ConfirmProgressFormValues } from "./empty-translator-file-dialog"
import { isInWorkingState } from "@/lib/project-status-utils"
import { useLocale, useTranslations } from "next-intl"
import { TranslatorReviewCard } from "@/modules/user-dashboard/user/review/translator-review-card"
import { CompanyReviewCard } from "@/modules/user-dashboard/user/review/company-review-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export type TranslatorProjectType = {
  project: ProjectType
  sourceFile: ProjectFileType | null
  targetFile: ProjectFileType | null
  companyReview: CompanyReviewType | null
  translatorReview: TranslatorReviewType | null
  client: typeof user.$inferSelect | null
}

interface ProjectToTranslateProps {
  projectToTranslate: TranslatorProjectType
  user: User
}

type AcceptState = "n/a" | "waiting for approval" | "accepted" | "rejected"

export const ProjectToTranslate = ({ projectToTranslate, user }: ProjectToTranslateProps) => {
  const t = useTranslations("ProjectToTranslate")
  const locale = useLocale()

  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isQADialogOpen, setIsQADialogOpen] = useState(false)
  const [isEmptyFileDialogOpen, setIsEmptyFileDialogOpen] = useState(false)

  const project = projectToTranslate.project
  const sourceFile = projectToTranslate.sourceFile
  const targetFile = projectToTranslate.targetFile
  const translatorReview = projectToTranslate.translatorReview
  const companyReview = projectToTranslate.companyReview
  const client = projectToTranslate.client

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const updateProgressMutation = useMutation(
    trpc.projects.updateProgress.mutationOptions({
      onSuccess: () => {
        toast.success(t("toast.progressUpdated"))
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const sentEmail = useMutation(trpc.emails.sendToUser.mutationOptions())

  const changeStatusMutation = useMutation(trpc.projects.changeProjectStatus.mutationOptions())

  async function notifyUser() {
    if (!client?.email) {
      toast.error("User is not currently available. Project finish e-mail cannot be sent to them")
      return
    }
    await sentEmail.mutateAsync({
      to: client?.email,
      subject: "Your project is translated",
      body: `Your project ${project.name} is finished and is waiting for your approval`
    })
  }

  const onEmptyTranslatedFileDialogConfirm = async (values: ConfirmProgressFormValues) => {
    const markAsQA = values.markAsQA
    const progress = 100

    await updateProgressMutation.mutateAsync({
      projectId: project.id,
      newProgress: progress
    })

    if (markAsQA) {
      await changeStatusMutation.mutateAsync({
        projectId: project.id,
        projectStatus: "QA"
      })

      await notifyUser()
    }

    await queryClient.invalidateQueries({
      queryKey: trpc.projects.getManyAsTranslator.queryKey({ translatorId: user.id })
    })
  }

  async function handleUpdateProgress(progress: number) {
    if (progress === 100 && !targetFile?.id) {
      setIsProgressDialogOpen(false)
      setIsEmptyFileDialogOpen(true)
      return
    }

    await updateProgressMutation.mutateAsync({
      projectId: project.id,
      newProgress: progress
    })

    if (project.progressPercent === 0 && progress > 0) {
      await changeStatusMutation.mutateAsync({
        projectId: project.id,
        projectStatus: "IN_PROGRESS"
      })
    }

    await queryClient.invalidateQueries({
      queryKey: trpc.projects.getManyAsTranslator.queryKey({ translatorId: user.id })
    })

    if (project.status === "QA" && progress < 100) {
      setIsProgressDialogOpen(false)
      setIsStatusDialogOpen(true)
      return
    }

    if (progress === 100 && isInWorkingState(project.status)) {
      setIsQADialogOpen(true)
      setIsStatusDialogOpen(false)
      return
    }
  }

  const onQADialogConfirm = async () => {
    await changeStatusMutation.mutateAsync({
      projectId: project.id,
      projectStatus: "QA"
    })

    await notifyUser()

    await queryClient.invalidateQueries({
      queryKey: trpc.projects.getManyAsTranslator.queryKey({ translatorId: user.id })
    })
  }

  const onStatusDialogConfirm = async () => {
    await changeStatusMutation.mutateAsync({
      projectId: project.id,
      projectStatus: "IN_PROGRESS"
    })

    await queryClient.invalidateQueries({
      queryKey: trpc.projects.getManyAsTranslator.queryKey({ translatorId: user.id })
    })
  }

  const { mutateAsync: getSourceFileAsync } = useMutation(trpc.projects.getSourceProjectFile.mutationOptions())

  const { mutateAsync: getTranslatedFileAsync, isPending: isPendingViewingTranslatedFile } = useMutation(
    trpc.projects.getTranslatedFile.mutationOptions({
      onSuccess: () => {
        toast.success(t("toast.fileObtained"))
      },
      onError: () => {
        toast.error(t("toast.fileCannotBeObtained"))
      }
    })
  )

  async function viewFile() {
    const projectFile = await getSourceFileAsync({ projectId: project.id })
    await performPreview(projectFile.projectFile)
  }

  const previewFileMutation = useMutation({
    mutationFn: viewFile
  })

  async function handleViewFile() {
    await previewFileMutation.mutateAsync()
  }

  async function download() {
    const projectFile = await getSourceFileAsync({ projectId: project.id })
    await performDownload(projectFile.projectFile)
  }

  const downloadMutation = useMutation({
    mutationFn: download
  })

  const handleDownloadFile = async () => {
    downloadMutation.mutate()
  }

  const viewTranslatedFile = async () => {
    const translated = await getTranslatedFileAsync({ projectId: project.id })
    await performPreview(translated.translatedFile)
  }

  const formatDeadline = (date: Date | null) => {
    if (!date) return t("deadline.noDeadline")
    return new Date(date).toLocaleString(locale === "cs" ? "cs-CZ" : locale === "en" ? "en-US" : locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatDateOnly = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString(locale === "cs" ? "cs-CZ" : locale === "en" ? "en-US" : locale)
  }

  const formatDateTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleString(locale === "cs" ? "cs-CZ" : locale === "en" ? "en-US" : locale)
  }

  const getDaysUntilDue = (dueDate: Date | null) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const daysUntilDue = getDaysUntilDue(project.dueAt)
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0
  const hasTranslatorReview = !!translatorReview
  const hasCompanyReview = !!companyReview
  const hasAnyReview = hasTranslatorReview || hasCompanyReview

  const isProjectModifiable = () => {
    return project.status === "NEW" || project.status === "QA" || project.status === "IN_PROGRESS" || project.status === "ASSIGNED"
  }

  const dueSuffix = (() => {
    if (daysUntilDue === null) return null
    if (isOverdue) return t("deadline.daysOverdue", { days: Math.abs(daysUntilDue) })
    if (daysUntilDue === 1) return t("deadline.dayLeft", { days: 1 })
    return t("deadline.daysLeft", { days: daysUntilDue })
  })()

  // -----------------------------
  // Customer decision panel (NEW)
  // -----------------------------
  const acceptState = (project.acceptState ?? "n/a") as AcceptState

  const decisionUi = useMemo(() => {
    if (acceptState === "accepted") {
      return {
        icon: BadgeCheck,
        title: "Zákazník schválil překlad",
        description: "Projekt byl zákazníkem akceptován. Pokud je vše hotové, projekt bude uzavřen dle interního procesu.",
        badgeVariant: "default" as const,
        badgeText: "Accepted",
        badgeIcon: ThumbsUp
      }
    }

    if (acceptState === "rejected") {
      return {
        icon: AlertTriangle,
        title: "Zákazník požaduje úpravy",
        description:
          "Projekt byl zákazníkem zamítnut. Očekávejte požadavek na revize; doporučujeme zákazníka kontaktovat a upřesnit očekávání.",
        badgeVariant: "destructive" as const,
        badgeText: "Rejected",
        badgeIcon: ThumbsDown
      }
    }

    if (acceptState === "waiting for approval") {
      return {
        icon: Hourglass,
        title: "Čeká se na odpověď zákazníka",
        description: "Překlad je předán k hodnocení. Jakmile zákazník rozhodne, stav se zde automaticky aktualizuje.",
        badgeVariant: "secondary" as const,
        badgeText: "Waiting for approval",
        badgeIcon: ShieldCheck
      }
    }

    return null
  }, [acceptState])

  const showDecisionPanel =
    acceptState === "accepted" || acceptState === "rejected" || acceptState === "waiting for approval"

  return (
    <Card className={isOverdue ? "border-red-500/50" : isUrgent ? "border-yellow-500/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>

            {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <Languages className="h-4 w-4" />
                <span className="font-medium">
                  {project.sourceLanguage.toUpperCase()} → {project.targetLanguage.toUpperCase()}
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className={isOverdue ? "text-red-500 font-medium" : isUrgent ? "text-yellow-500 font-medium" : ""}>
                  {formatDeadline(project.dueAt)}
                  {dueSuffix && <span className="ml-1">({dueSuffix})</span>}
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t("meta.created", { date: formatDateOnly(project.createdAt) })}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* NEW: Customer decision panel */}
        {showDecisionPanel && decisionUi && (
          <div className="pt-1">
            <Alert
              className={
                acceptState === "accepted"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : acceptState === "rejected"
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-primary/30 bg-primary/5"
              }
            >
              <AlertTitle className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <decisionUi.icon className="h-4 w-4" />
                  <span>{decisionUi.title}</span>
                </div>

                <Badge variant={decisionUi.badgeVariant} className="gap-1">
                  <decisionUi.badgeIcon className="h-3.5 w-3.5" />
                  {decisionUi.badgeText}
                </Badge>
              </AlertTitle>

              <AlertDescription className="mt-2 space-y-3">
                <p className="text-sm text-muted-foreground">{decisionUi.description}</p>

                {(acceptState === "accepted" || acceptState === "rejected") && (
                  <>
                    <Separator />
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                      <div className="text-xs text-muted-foreground">
                        Tip: pokud je potřeba rychlé vyjasnění, použijte chat se zákazníkem přímo z této karty.
                      </div>

                      {client && (
                        <ChatDialog client={client} translationNamespace="ProjectToTranslate.contact" />
                      )}
                    </div>
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">{t("progress.title")}</span>
            <span className="font-bold text-lg">{project.progressPercent}%</span>
          </div>

          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-500 rounded-full ${
                project.progressPercent === 100
                  ? "bg-green-500"
                  : project.progressPercent >= 75
                    ? "bg-blue-500"
                    : project.progressPercent >= 50
                      ? "bg-yellow-500"
                      : "bg-orange-500"
              }`}
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">{t("progress.lastUpdated", { dateTime: formatDateTime(project.updatedAt) })}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <ProgressDialog
            isOpen={isProgressDialogOpen}
            onOpenChange={setIsProgressDialogOpen}
            onConfirm={handleUpdateProgress}
            isTooltipDisabled={!isProjectModifiable()}
            project={project}
          />

          {/* Note: Chat is already offered inside the decision panel for accepted/rejected.
              Keep here for general access if you prefer. */}
          {!showDecisionPanel && client && <ChatDialog client={client} translationNamespace="ProjectToTranslate.contact" />}

          <Button variant="outline" size="sm" onClick={handleViewFile} disabled={!sourceFile || previewFileMutation.isPending}>
            <Eye className="mr-2 h-4 w-4" />
            {previewFileMutation.isPending ? t("actions.creatingView") : t("actions.view")}
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownloadFile} disabled={!sourceFile || downloadMutation.isPending}>
            <Download className="mr-2 h-4 w-4" />
            {downloadMutation.isPending ? t("actions.waitingDownload") : t("actions.download")}
          </Button>

          <UploadTranslatedFileDialog project={project} user={user} />

          {targetFile && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={async () => {
                await viewTranslatedFile()
              }}
              disabled={isPendingViewingTranslatedFile}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isPendingViewingTranslatedFile ? t("actions.gettingTranslated") : t("actions.viewTranslated")}
            </Button>
          )}
        </div>

        {hasAnyReview && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">{t("reviews.title")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hasTranslatorReview && translatorReview && <TranslatorReviewCard translatorReview={translatorReview} />}
              {hasCompanyReview && companyReview && <CompanyReviewCard companyReview={companyReview} />}
            </div>
          </div>
        )}
      </CardContent>

      <ProjectStatusDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen} onConfirm={onStatusDialogConfirm} />
      <QAStatusDialog open={isQADialogOpen} onOpenChange={setIsQADialogOpen} onConfirm={onQADialogConfirm} />
      <ConfirmProgressDialog
        isOpen={isEmptyFileDialogOpen}
        onOpenChange={setIsEmptyFileDialogOpen}
        onConfirm={onEmptyTranslatedFileDialogConfirm}
      />
    </Card>
  )
}
