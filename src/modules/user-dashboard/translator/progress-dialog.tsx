"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProjectClosedTooltip } from "./project-closed-tooltip"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ProjectType } from "@/db/schema"
import { useState } from "react"

interface ProgressDialogProps {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirm: (progress: number) => Promise<void>,
    isTooltipDisabled: boolean,
    project: ProjectType
}

export const ProgressDialog = ({ isOpen, onOpenChange, onConfirm, isTooltipDisabled, project } : ProgressDialogProps) => {
    const [draftProgress, setDraftProgress] = useState(project.progressPercent);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirm = async (progress: number) => {
        console.log("new progress", progress)
        setIsSubmitting(true);
        await onConfirm(progress);
        setIsSubmitting(false);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open)

            // při OTEVŘENÍ dialogu resetujeme draft na aktuální hodnotu z projektu
            if (open) {
                setDraftProgress(project.progressPercent)
            }
        }}>
          <ProjectClosedTooltip disabled={isTooltipDisabled}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isTooltipDisabled}
                >
                  Update Progress
                </Button>
              </DialogTrigger>
          </ProjectClosedTooltip>


            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Update Translation Progress</DialogTitle>
                <DialogDescription>Adjust the completion percentage for {project.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base">Progress</Label>
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
                      <span>Not Started</span>
                      <span>In Progress</span>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={async () => { await handleConfirm(draftProgress) }} disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? "Saving..." : "Save Progress"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
    )
}

