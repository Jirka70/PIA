"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CompanyReviewType, ProjectFileType, ProjectType, TranslatorReviewType } from "@/db/schema"
import { performDownload, performPreview } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Calendar, Clock, Languages, Eye, Download } from "lucide-react"
import { useState } from "react"
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

export type TranslatorProjectType = {
  project: ProjectType
  sourceFile: ProjectFileType | null
  targetFile: ProjectFileType | null
  companyReview: CompanyReviewType | null
  translatorReview: TranslatorReviewType | null
}

interface ProjectToTranslateProps {
  projectToTranslate: TranslatorProjectType
  user: User
}

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

  const changeStatusMutation = useMutation(trpc.projects.changeProjectStatus.mutationOptions())

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

  const isProjectModifiable = () => {
    return (
      project.status === "NEW" ||
      project.status === "QA" ||
      project.status === "IN_PROGRESS" ||
      project.status === "ASSIGNED"
    )
  }

  const dueSuffix = (() => {
    if (daysUntilDue === null) return null
    if (isOverdue) return t("deadline.daysOverdue", { days: Math.abs(daysUntilDue) })
    if (daysUntilDue === 1) return t("deadline.dayLeft", { days: 1 })
    return t("deadline.daysLeft", { days: daysUntilDue })
  })()

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

          <p className="text-xs text-muted-foreground">
            {t("progress.lastUpdated", { dateTime: formatDateTime(project.updatedAt) })}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <ProgressDialog
            isOpen={isProgressDialogOpen}
            onOpenChange={setIsProgressDialogOpen}
            onConfirm={handleUpdateProgress}
            isTooltipDisabled={!isProjectModifiable()}
            project={project}
          />

          <ChatDialog />

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewFile}
            disabled={!sourceFile || previewFileMutation.isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewFileMutation.isPending ? t("actions.creatingView") : t("actions.view")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadFile}
            disabled={!sourceFile || downloadMutation.isPending}
          >
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
      </CardContent>

      <ProjectStatusDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen} onConfirm={onStatusDialogConfirm} />
      <QAStatusDialog open={isQADialogOpen} onOpenChange={setIsQADialogOpen} onConfirm={onQADialogConfirm} />
      <ConfirmProgressDialog isOpen={isEmptyFileDialogOpen} onOpenChange={setIsEmptyFileDialogOpen} onConfirm={onEmptyTranslatedFileDialogConfirm} />
    </Card>
  )
}
