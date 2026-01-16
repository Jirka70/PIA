"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { useTranslations } from "next-intl"

export type ConfirmProgressFormValues = {
  markAsQA: boolean
}

interface ConfirmProgressDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (values: ConfirmProgressFormValues) => Promise<void> | void
}

export const ConfirmProgressDialog = ({ isOpen, onOpenChange, onConfirm }: ConfirmProgressDialogProps) => {
  const t = useTranslations("ConfirmProgressDialog")

  const form = useForm<ConfirmProgressFormValues>({
    defaultValues: {
      markAsQA: false
    }
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
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-sm">
            <p>
              <span className="font-semibold">{t("warning.title")}</span>{" "}
              {t("warning.noFile")}
            </p>
            <p className="text-muted-foreground">{t("warning.hint")}</p>
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
              <Label htmlFor="markAsQA">{t("checkbox.label")}</Label>
              <p className="text-xs text-muted-foreground">{t("checkbox.hint")}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("actions.cancel")}
            </Button>

            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? t("actions.saving") : t("actions.confirm")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
