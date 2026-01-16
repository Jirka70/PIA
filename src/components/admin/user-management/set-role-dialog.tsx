"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/server"
import { useTRPC } from "@/trpc/client"

interface SetRoleDialogProps {
  onOpenChange: (v: boolean) => void
  isOpen: boolean
  role: string
  userId: string
  onRoleChange: (newRole: string) => void
  onDialogSubmitted: (userId: string, role: string) => Promise<void>
}

export const SetRoleDialog = ({
  onOpenChange,
  isOpen,
  role,
  userId,
  onRoleChange,
  onDialogSubmitted
}: SetRoleDialogProps) => {
  const t = useTranslations("SetRoleDialog")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const trpc = useTRPC()

  const onSubmit = async () => {
    setIsSubmitting(true)
    await onDialogSubmitted(userId, role)
    onOpenChange(false)
    setIsSubmitting(false)
  }

  const {data: user} = useQuery(trpc.users.getUserById.queryOptions({
    id: userId
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("header.title") + " " + user?.user?.name}</DialogTitle>
          <DialogDescription>{t("header.description") + user?.user?.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role">{t("fields.roleLabel")}</Label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t("roles.user")}</SelectItem>
                <SelectItem value="translator">{t("roles.translator")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("actions.cancel")}
          </Button>

          <Button onClick={async () => await onSubmit()} disabled={isSubmitting}>
            <span>{isSubmitting ? t("actions.applying") : t("actions.save")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
