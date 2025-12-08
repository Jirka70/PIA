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

export type TranslatorProjectType = {
  project: ProjectType,
  sourceFile: ProjectFileType | null,
  targetFile: ProjectFileType | null,
  companyReview: CompanyReviewType | null,
  translatorReview: TranslatorReviewType | null
}

interface ProjectToTranslateProps {
  projectToTranslate: TranslatorProjectType,
  user: User
}

export const ProjectToTranslate = ({ projectToTranslate, user }: ProjectToTranslateProps) => {
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isQADialogOpen, setIsQADialogOpen] = useState(false);
  const [isEmptyFileDialogOpen, setIsEmptyFileDialogOpen] = useState(false);

  const project = projectToTranslate.project
  const sourceFile = projectToTranslate.sourceFile
  const targetFile = projectToTranslate.targetFile
  const translatorReview = projectToTranslate.translatorReview
  const companyReview = projectToTranslate.companyReview
   


  const trpc = useTRPC();
  const updateProgressMutation = useMutation(trpc.projects.updateProgress.mutationOptions({
    onSuccess: () => {
      toast.success("Progress was successfully updated")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  }))

  const changeStatusMutation = useMutation(trpc.projects.changeProjectStatus.mutationOptions())

  const onEmptyTranslatedFileDialogConfirm = async (values: ConfirmProgressFormValues) => {
    const markAsQA = values.markAsQA;
    const progress = 100;

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

  console.log(projectToTranslate)



  const queryClient = useQueryClient();
  async function handleUpdateProgress(progress: number) {
    if (progress === 100 && !targetFile?.id) {
      setIsProgressDialogOpen(false);
      setIsEmptyFileDialogOpen(true);
      return;
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
      setIsProgressDialogOpen(false);
      setIsStatusDialogOpen(true);
      return;
    }

    if (progress === 100 && (
      project.status === "IN_PROGRESS" || project.status === "NEW")) {
        setIsQADialogOpen(true)
        setIsStatusDialogOpen(false)
        return;
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

  const previewFileMutation = useMutation({
    mutationFn: viewFile
  })

  const { mutateAsync: getSourceFileAsync } = useMutation(trpc.projects.getSourceProjectFile.mutationOptions())
  const { mutateAsync: getTranslatedFileAsync, isPending: isPendingViewingTranslatedFile } = useMutation(trpc.projects.getTranslatedFile.mutationOptions({
    onSuccess: () => {
      toast.success("File was successfully obtained")
    }, 
    onError: () => {
      toast.error("File cannot be obtained")
    }
  }));

  async function viewFile()  {
      const projectFile = await getSourceFileAsync({
        projectId: project.id
      })

      await performPreview(projectFile.projectFile)
  }

  async function handleViewFile() {
    await previewFileMutation.mutateAsync()
  }

  async function download() {
    const projectFile = await getSourceFileAsync({
      projectId: project.id
    })

    await performDownload(projectFile.projectFile);
  }

  const downloadMutation = useMutation({
    mutationFn: download,
  });
  
  const handleDownloadFile = async () => {
      downloadMutation.mutate();
  }

  const viewTranslatedFile = async () => {
    const translatedFile = await getTranslatedFileAsync({
      projectId: project.id
    })

    await performPreview(translatedFile.translatedFile)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysUntilDue = (dueDate: Date | null) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue(project.dueAt)
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0

    const isProjectModifiable = () => {
    return project.status === "NEW"
      || project.status === "QA"
      || project.status === "IN_PROGRESS"
  }


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
                <span
                  className={isOverdue ? "text-red-500 font-medium" : isUrgent ? "text-yellow-500 font-medium" : ""}
                >
                  {formatDate(project.dueAt)}
                  {daysUntilDue !== null && (
                    <span className="ml-1">
                      ({isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""} left`})
                    </span>
                  )}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Translation Progress</span>
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
          <p className="text-xs text-muted-foreground">Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {/* Update Progress Dialog */}
          <ProgressDialog isOpen={isProgressDialogOpen} 
              onOpenChange={setIsProgressDialogOpen}
              onConfirm={handleUpdateProgress}
              isTooltipDisabled={!isProjectModifiable()} 
              project={project}              
          />
          <ChatDialog />

          <Button variant="outline" size="sm" onClick={handleViewFile} disabled={!sourceFile || previewFileMutation.isPending}>
            <Eye className="mr-2 h-4 w-4" />
            {previewFileMutation.isPending ? "Creating View..." : "View"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadFile} disabled={!sourceFile || downloadMutation.isPending}>
            <Download className="mr-2 h-4 w-4" />
              
              {downloadMutation.isPending ? "Waiting for start donwload..." : "Download"}
          </Button>
          <UploadTranslatedFileDialog project={project} user={user} />
          {targetFile && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={async () => { await viewTranslatedFile()}}
              disabled={isPendingViewingTranslatedFile}
              >
                <Eye className="mr-2 h-4 w-4" />
                {isPendingViewingTranslatedFile ? "Getting Translated File" : "View Translated File"}
            </Button>
          )}
        </div>
      </CardContent>
      <ProjectStatusDialog 
       open={isStatusDialogOpen}
       onOpenChange={setIsStatusDialogOpen}
       onConfirm={onStatusDialogConfirm}
      />
      <QAStatusDialog
        open={isQADialogOpen}
        onOpenChange={setIsQADialogOpen}
        onConfirm={onQADialogConfirm}
      />
      <ConfirmProgressDialog 
        isOpen={isEmptyFileDialogOpen}
        onOpenChange={setIsEmptyFileDialogOpen}
        onConfirm={onEmptyTranslatedFileDialogConfirm}
      />
    </Card>
  )
}
