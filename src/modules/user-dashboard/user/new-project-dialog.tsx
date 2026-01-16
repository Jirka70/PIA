"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { cs as csLocale, enUS as enLocale } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Upload, X, CalendarX } from "lucide-react"
import { User } from "better-auth"
import { CreateProjectFormInput, createProjectInput } from "@/lib/validators/create-project-schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon } from "lucide-react"
import { cn, uploadFile } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"

type LanguageItem = { code: string; name: string }

interface NewDialogProps {
  user: User
}

export function NewProjectDialog({ user }: NewDialogProps) {
  const t = useTranslations("NewProjectDialog")
  const locale = useLocale() // "cs" | "en" (dle tvé next-intl konfigurace)
  const dateLocale = locale === "cs" ? csLocale : enLocale
  const dateFormat = locale === "cs" ? "d. MMMM yyyy" : "MMMM d, yyyy"

  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const languages = t.raw("languages.list") as LanguageItem[]

  const form = useForm<CreateProjectFormInput>({
    resolver: zodResolver(createProjectInput),
    defaultValues: {
      name: "",
      description: "",
      dueAt: undefined as unknown as Date | undefined
    }
  })

  const trpc = useTRPC()
  const { mutateAsync: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: () => {
        toast.success(t("toast.projectCreated"))
        form.reset()
        setOpen(false)

        queryClient.invalidateQueries(
          trpc.projects.getManyAsUser.queryOptions({
            userId: user.id
          })
        )

        queryClient.invalidateQueries(
          trpc.projects.getProjectsCreatedLastMonth.queryOptions({
            id: user.id
          })
        )
      },
      onError: (err) => {
        toast.error(err.message)
        setOpen(false)
      }
    })
  )

  function removeFile() {
    form.setValue("file", undefined as any, {
      shouldValidate: true,
      shouldDirty: true
    })

    if (inputRef.current) {
      inputRef.current.value = ""
    }

    toast.info(t("toast.fileRemoved"))
  }

  async function handleFileUpload(file: File) {
    const fd = new FormData()
    fd.append("file", file)

    setUploading(true)
    try {
      const data = await uploadFile(fd)

      form.setValue(
        "file",
        {
          fileName: data.fileName as string,
          contentType: data.contentType as string,
          size: Number(data.size),
          storageKey: data.storageKey as string,
          url: data.url as string,
          fileId: data.id as string
        },
        {
          shouldValidate: true,
          shouldDirty: true
        }
      )

      toast.success(t("toast.fileUploaded"))
    } catch (err: any) {
      toast.error(err?.message ?? t("toast.uploadFailed"))
      form.setValue("file", undefined as any, {
        shouldValidate: true
      })

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: CreateProjectFormInput) => {
    await createProject({
      ...data,
      dueAt: data.dueAt ? new Date(data.dueAt) : undefined
    })
  }

  const minDate = (() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })()

  const fileMeta = form.watch("file")
  const clearDueDate = () => form.setValue("dueAt", undefined as any, { shouldDirty: true, shouldValidate: true })
  const dialogContentId = "new-project-dialog-content"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogContentId}
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("button.newProject")}
      </Button>

      <DialogContent
        id={dialogContentId}
        className="
          sm:max-w-[600px]
          w-[95%]
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          p-6
          pr-8
          pt-8
          pb-8
          bg-background
        "
      >
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.projectName.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.projectName.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.targetLanguage.label")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.targetLanguage.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder={t("form.description.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueAt"
              render={({ field }) => {
                const selected = field.value ? new Date(field.value as Date) : undefined
                return (
                  <FormItem>
                    <FormLabel>{t("form.deadline.label")}</FormLabel>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn("w-[280px] justify-start text-left font-normal", !selected && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selected ? (
                                <span>{format(selected, dateFormat, { locale: dateLocale })}</span>
                              ) : (
                                <span>{t("form.deadline.pickDate")}</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selected}
                            onSelect={(date) => {
                              if (!date) return clearDueDate()
                              const sameDay = selected && date.toDateString() === selected.toDateString()
                              field.onChange(sameDay ? undefined : date)
                            }}
                            disabled={(date) => date < minDate}
                            fixedWeeks
                            showOutsideDays
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>

                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2"
                        onClick={clearDueDate}
                        disabled={!selected || isPending}
                        title={t("form.deadline.clearTitle")}
                      >
                        <CalendarX className="h-4 w-4" />
                        {t("form.deadline.clear")}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>{t("form.sourceFile.label")}</FormLabel>
                  <FormControl>
                    <div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          ref={inputRef}
                          disabled={uploading || isPending}
                          onChange={async (e) => {
                            const f = e.currentTarget.files?.[0]
                            if (f) await handleFileUpload(f)
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => inputRef.current?.click()}
                          disabled={uploading || isPending}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> {t("form.sourceFile.uploading")}
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" /> {t("form.sourceFile.upload")}
                            </>
                          )}
                        </Button>
                      </div>

                      {fileMeta ? (
                        <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium">{fileMeta.fileName}</span>
                            <span className="text-muted-foreground">
                              {fileMeta.contentType} · {(fileMeta.size / 1024).toFixed(1)} kB
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 px-2 text-red-600 hover:text-red-700"
                            onClick={removeFile}
                            disabled={uploading || isPending}
                            title={t("form.sourceFile.removeTitle")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("form.sourceFile.hint")}</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                {t("form.actions.cancel")}
              </Button>
              <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isPending ? t("form.actions.creating") : t("form.actions.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
