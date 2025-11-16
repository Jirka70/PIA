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

export const SingleProjectView = ({ project, clientName, clientEmail, translatorName, translatorEmail } : SingleProjectViewProps) => {
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [isUpdatingStatus] = useState(false)

    const trpc = useTRPC()

    const { isPending: isSourceFilePending, mutateAsync: getSourceFileAsync } =
    useMutation(
        trpc.projects.getSourceProjectFile.mutationOptions({
            onError: (error) => {
                toast.error(error.message ?? "Cannot obtain source file")
            },
        })
    )

    const {
        isPending: isTranslatedFilePending,
        mutateAsync: getTranslatedFileAsync,
    } = useMutation(
        trpc.projects.getTranslatedFile.mutationOptions({
            onError: (error) => {
            toast.error(error.message ?? "Cannot obtain source file")
            },
        })
    )
    
    const daysUntilDue = getDaysUntilDue(project.dueAt)
    const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0

      async function handleViewSourceFile() {
        toast.info("Getting file to view...")
        const srcFile = await getSourceFileAsync({ projectId: project.id })
        if (srcFile.projectFile.fileName.toLocaleLowerCase().endsWith(".docx")) {
          toast.warning("File has .docx extension - cannot create a view, preparing downloading...")
        }
        await performPreview(srcFile.projectFile)
      }
    
      async function handleDownloadSourceFile() {
        toast.info("Getting file to download...")
        const srcFile = await getSourceFileAsync({ projectId: project.id })
        await performDownload(srcFile.projectFile)
      }
    
      async function handleViewTranslatedFile() {
        toast.info("Getting file to view...")
        const translatedFile = await getTranslatedFileAsync({ projectId: project.id })
        if (translatedFile.translatedFile.fileName.toLocaleLowerCase().endsWith(".docx")) {
          toast.warning("File has .docx extension - cannot create a view, preparing downloading...")
        }
        await performPreview(translatedFile.translatedFile)
      }
    
      async function handleDownloadTranslatedFile() {
        toast.info("Getting file to download...")
        const translatedFile = await getTranslatedFileAsync({ projectId: project.id })
        await performDownload(translatedFile.translatedFile)
      }

    return (
        <Card
          className={
            isOverdue
              ? "border-red-500/50 shadow-lg"
              : isUrgent
              ? "border-yellow-500/50 shadow-lg"
              : ""
          }
        >
          <ProjectHeader
            project={project}
            isOverdue={isOverdue}
            isUrgent={isUrgent}
            isStatusDialogOpen={isStatusDialogOpen}
            setIsStatusDialogOpen={setIsStatusDialogOpen}
            isUpdatingStatus={isUpdatingStatus}
          />

          <div className="space-y-6 px-6 pb-6">
            <ProjectDetailsGrid
              project={project}
              clientName={clientName}
              clientEmail={clientEmail}
              translatorName={translatorName}
              translatorEmail={translatorEmail}
            />

            <Separator />

            <ProgressSection progressPercent={project.progressPercent} progressNote={project.progressNote} />

            <Separator />

            <FilesSection
              hasSourceFile={!!project.sourceFileId}
              hasTranslatedFile={!!project.translatedFileId}
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