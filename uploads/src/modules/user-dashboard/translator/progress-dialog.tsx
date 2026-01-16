"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ProjectClosedTooltip } from "./project-closed-tooltip"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ProjectType } from "@/db/schema"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface ProgressDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (progress: number) => Promise<void>
  isTooltipDisabled: boolean
  project: ProjectType
}

export const ProgressDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isTooltipDisabled,
  project
}: ProgressDialogProps) => {
  const t = useTranslations("ProgressDialog")

  const [draftProgress, setDraftProgress] = useState(project.progressPercent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async (progress: number) => {
    setIsSubmitting(true)
    await onConfirm(progress)
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (open) setDraftProgress(project.progressPercent)
      }}
    >
      <ProjectClosedTooltip disabled={isTooltipDisabled}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" disabled={isTooltipDisabled}>
            {t("trigger")}
          </Button>
        </DialogTrigger>
      </ProjectClosedTooltip>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description", { projectName: project.name })}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base">{t("progressLabel")}</Label>
                <span className="text-2xl font-bold">{draftProgress}%</span>
              </div>

              <Slider
                defaultValue={[project.progressPercent]}
                value={[draftProgress]}
                onValueChange={(value) => setDraftProgress(value[0])}
                max={100}
                step={5}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("scale.notStarted")}</span>
                <span>{t("scale.inProgress")}</span>
                <span>{t("scale.complete")}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={async () => {
                await handleConfirm(draftProgress)
              }}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? t("actions.saving") : t("actions.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
