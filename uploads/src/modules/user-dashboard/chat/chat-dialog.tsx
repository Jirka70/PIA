"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { user } from "@/db/schema"
import { useTranslations } from "next-intl"

type ClientType = typeof user.$inferSelect

const contactSchema = z.object({
  subject: z.string().optional(),
  body: z.string().optional()
})

interface ChatDialogProps {
  client: ClientType
  triggerLabel?: string
  title?: string
  description?: string
  translationNamespace?: string
}

export function ChatDialog({
  client,
  triggerLabel,
  title,
  description,
  translationNamespace
}: ChatDialogProps) {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()
  const t = useTranslations(translationNamespace ?? "UserProject.contact")

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      body: ""
    }
  })

  const sendMessage = useMutation(
    trpc.emails.sendToUser.mutationOptions({
      onSuccess: () => {
        toast.success(t("success"))
        form.reset()
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    sendMessage.mutate({
      to: client.email,
      subject: values.subject ?? "",
      body: values.body ?? ""
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          {triggerLabel ?? t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title ?? t("title")}</DialogTitle>
          <DialogDescription>
            {description ?? t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("recipientLabel")}</label>
            <Input value={`${client.name ?? ""} <${client.email}>`} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("subjectLabel")}</label>
            <Input placeholder={t("subjectPlaceholder")} {...form.register("subject")} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("bodyLabel")}</label>
            <Textarea
              placeholder={t("bodyPlaceholder")}
              className="min-h-[120px]"
              {...form.register("body")}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={sendMessage.isPending}>
            {sendMessage.isPending ? t("sending") : t("send")}
            <Send className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
