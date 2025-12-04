"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm, Controller } from "react-hook-form"
import { useState } from "react"

export type ConfirmProgressFormValues = {
  markAsQA: boolean
}

interface ConfirmProgressDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (values: ConfirmProgressFormValues) => Promise<void> | void
}

export const ConfirmProgressDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: ConfirmProgressDialogProps) => {
  const form = useForm<ConfirmProgressFormValues>({
    defaultValues: {
      markAsQA: false,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    await onConfirm(values)
    setIsSubmitting(false)
    onOpenChange(false)
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm 100% progress</DialogTitle>
          <DialogDescription>
            You are about to set the translation progress to{" "}
            <span className="font-semibold">100%</span>, but no translated file has been uploaded yet.
            Are you sure you want to mark this project as fully completed?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-sm">
            <p>
              <span className="font-semibold">Warning:</span> There is currently{" "}
              <span className="font-semibold">no translated file uploaded</span> for this project.
            </p>
            <p className="text-muted-foreground">
              Setting the progress to 100% usually means the translation work is done and the file is ready for review.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Controller
              name="markAsQA"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  id="markAsQA"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="markAsQA">Mark project as QA</Label>
              <p className="text-xs text-muted-foreground">
                If checked, the project will be moved to the QA status after saving.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
