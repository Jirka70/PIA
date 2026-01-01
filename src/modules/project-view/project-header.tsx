"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { useState } from "react"
import { StatusBadge } from "./status-badge"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectLanguagesSkeleton } from "../manage-translator/edit-languages-dialog"
import { ProjectStatusType, ProjectType } from "@/db/schema"
import { useTranslations } from "next-intl"
import { DoneBlockedDialog } from "./done-blocked-dialog"

interface ProjectHeaderProps {
  project: ProjectType
  isOverdue: boolean
  isUrgent: boolean
  isStatusDialogOpen: boolean
  setIsStatusDialogOpen: (open: boolean) => void
  isStatusUpdating: boolean
  onStatusUpdate: (newStatus: ProjectStatusType, projectId: string) => Promise<void>,
  availableStatuses?: ProjectStatusType[]
}

export function ProjectHeader({
  project,
  isOverdue,
  isUrgent,
  isStatusDialogOpen,
  setIsStatusDialogOpen,
  isStatusUpdating,
  onStatusUpdate,
  availableStatuses
}: ProjectHeaderProps) {
  const t = useTranslations("ProjectHeader")

  const [projectStatus, setProjectStatus] = useState<ProjectStatusType | undefined>(project.status)
  const [doneBlockedDialogOpen, setDoneBlockedDialogOpen] = useState(false);
  const [isForcing, setIsForcing] = useState(false)

  const onForceDone = async () => {
    setIsForcing(true)
    await onStatusUpdate("DONE", project.id);
    setIsStatusDialogOpen(false)
    toast.warning("Project was marked as 'Done'")
    setIsForcing(false)
  }


  const updateStatus = async () => {
    if (!projectStatus) {
      toast.error(t("toasts.noStatusSelected"))
      return
    }

    if (projectStatus === "DONE" && project.acceptState !== "accepted") {
      setDoneBlockedDialogOpen(true)
      return;
    } 

    await onStatusUpdate?.(projectStatus, project.id)
    setIsStatusDialogOpen(false)
  }

  return (
    <div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <StatusBadge status={project.status} />
              {isOverdue && (
                <Badge variant="destructive" className="animate-pulse">
                  {t("badges.overdue")}
                </Badge>
              )}
              {isUrgent && <Badge className="bg-yellow-500 text-white">{t("badges.urgent")}</Badge>}
            </div>

            {project.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            )}
          </div>

          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {t("actions.changeStatus")}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("dialog.title")}</DialogTitle>
                <DialogDescription>{t("dialog.description", { projectName: project.name })}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t("fields.statusLabel")}</Label>

                  <Select value={projectStatus} onValueChange={(value) => setProjectStatus(value as ProjectStatusType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {availableStatuses ? (
                        availableStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectLanguagesSkeleton />
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                    {t("actions.cancel")}
                  </Button>

                  <Button disabled={isStatusUpdating} onClick={async () => await updateStatus()}>
                    {isStatusUpdating ? t("actions.updating") : t("actions.updateStatus")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <DoneBlockedDialog 
        open={doneBlockedDialogOpen} 
        onOpenChange={setDoneBlockedDialogOpen}
        acceptState={project.acceptState}
        onForceDone={onForceDone}
        isForcing={isForcing}
      />
    </div>
  )
}
