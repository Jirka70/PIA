"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadedFileMeta } from "@/lib/validators/uploaded-file-meta"
import { Upload, Loader2, X } from "lucide-react"
import { cn, uploadFile } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import z from "zod"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ProjectType } from "@/db/schema"
import { useTRPC } from "@/trpc/client"
import { User } from "better-auth"
import { ProjectClosedTooltip } from "./project-closed-tooltip"

const uploadFileSchema = z.object({
    file: uploadedFileMeta,
    autoSetProgress: z.boolean(),
    autoSetQAState: z.boolean(),
})

interface UploadDialogProps {
  project: ProjectType,
  user: User
}


export function UploadTranslatedFileDialog({ project, user } : UploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>();
  const dragCounter = useRef(0);


  const form = useForm<z.infer<typeof uploadFileSchema>>({
    resolver: zodResolver(uploadFileSchema),
    mode: "onChange",
    defaultValues: {
      file: undefined,
      autoSetProgress: false,
      autoSetQAState: false,
    },
  })

  const handleFileUpload = async (file: File) => {
    const fd = new FormData()
    fd.append("file", file)

    setUploading(true)
    try {
      const data = await uploadFile(fd)
      
      form.setValue(
        "file", {
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

      toast.success("File uploaded successfully")
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed")
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

  const uploadFileMutation = useMutation({
    mutationFn: handleFileUpload
  })

  const fileMeta = form.watch("file")

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
  }

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutateAsync: uploadTranslatedFile, isPending } = useMutation(
  trpc.projects.uploadTranslatedFile.mutationOptions({
    onSuccess: async () => {
      form.reset()

      await queryClient.invalidateQueries({
        queryKey: trpc.projects.getManyAsTranslator.queryKey({
          translatorId: user.id,
        }),
      })

      toast.success("File successfully uploaded")
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
)


  type uploadFileSchemaType = z.infer<typeof uploadFileSchema>


  const onSubmit = async (data: uploadFileSchemaType) => {
    console.log("setQA", data.autoSetQAState)
    console.log("setProgressTo100", data.autoSetProgress)
    await uploadTranslatedFile({
      projectId: project.id,
      setProgressTo100: data.autoSetProgress,
      setQAState: data.autoSetQAState,
      ...data
    })

  }

  const isProjectModifiable = () => {
    return project.status === "NEW"
      || project.status === "QA"
      || project.status === "IN_PROGRESS"
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <ProjectClosedTooltip disabled={!isProjectModifiable()}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={!isProjectModifiable()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload translated file
          </Button>  
        </DialogTrigger>
      </ProjectClosedTooltip>


      <DialogContent
        className={cn(
          "sm:max-w-[560px] w-[95%] max-h-[90vh] overflow-y-auto rounded-2xl",
          "p-6 sm:p-8 bg-background"
        )}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>Description -- prepis to pak</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="file"
              render={() => {
                  const onDragEnter = (e: React.DragEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dragCounter.current += 1
                    setIsDragOver(true)
                  }

                  const onDragLeave = (e: React.DragEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dragCounter.current -= 1
                    if (dragCounter.current <= 0) {
                      setIsDragOver(false)
                      dragCounter.current = 0
                    }
                  }

                  const onDrop = (e: React.DragEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dragCounter.current = 0
                    setIsDragOver(false)

                    if (uploadFileMutation.isPending) return
                    const droppedFile = e.dataTransfer.files?.[0]
                    if (droppedFile) {
                      handleFileUpload(droppedFile)
                    }
                  }

                  const onDragOver = (e: React.DragEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }

                  return (
                  <FormItem>
                    <FormLabel>Translated file</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <motion.label
                          htmlFor="file"
                          onDrop={onDrop}
                          onDragOver={onDragOver}
                          onDragEnter={onDragEnter}
                          onDragLeave={onDragLeave}
                          aria-disabled={uploadFileMutation.isPending}
                          animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className={cn(
                            "relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 sm:p-8 text-center transition-colors cursor-pointer",
                            // běžný stav
                            !isDragOver && "hover:border-foreground/30",
                            // DRAG stav: zvýraznění
                            isDragOver &&
                              [
                                "border-solid",                 // z dashed na solid
                                "ring-2 ring-offset-2",         // prstenec
                                "ring-foreground/30",
                                "bg-foreground/[0.04]",         // jemné podbarvení
                                "border-foreground/50",
                              ].join(" ")
                          )}
                        >
                          {/* „glow“ pseudo-layer */}
                          {isDragOver && (
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.0)] before:absolute before:inset-0 before:rounded-xl before:blur-xl before:bg-foreground/10"
                            />
                          )}

                          <div className="pointer-events-none relative z-10 flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 sm:h-10 sm:w-10 opacity-70" />
                            <div className="text-sm">
                              <span className="font-medium">Přetáhni soubor</span> nebo{" "}
                              <span className="underline">vyber</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Povolené: PDF, DOC, DOCX, TXT</p>
                          </div>

                          <Input
                            ref={inputRef}
                            id="file"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="sr-only"
                            onChange={async (e) => {
                              const f = e.currentTarget.files?.[0]
                              if (f) {
                                await handleFileUpload(f)
                              }
                            }}
                            disabled={uploading || uploadFileMutation.isPending}
                          />
                        </motion.label>
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
                              disabled={uploading}
                              onClick={() => {
                                form.setValue("file", undefined as any)
                                if (inputRef.current) inputRef.current.value = ""
                              }}
                              
                              title="Remove file"
                            >
                              {(uploading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">PDF, DOC, DOCX nebo TXT. Max ~20 MB.</p>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 z-20 grid place-items-center rounded-xl bg-background/70 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3 w-10/12 max-w-sm">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <div className="text-sm font-medium">Nahrávám…</div>
                              {/* indeterminate bar */}
                              <div className="relative w-full h-1 rounded bg-muted overflow-hidden">
                                <div className="absolute inset-y-0 left-[-40%] w-2/5 bg-primary animate-[indeterminate_1.2s_infinite]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>)
              }}
            />
            <FormField
              control={form.control}
              name="autoSetProgress"
              render={({ field }) => (
                <FormItem className="pt-1">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auto-set-progress"
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                      <FormLabel htmlFor="auto-set-progress" className="font-normal">
                        Set progress to 100 % automatically
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="autoSetQAState"
              render={({ field }) => (
                <FormItem className="pt-1">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="auto-set-qa-state"
                          checked={!!field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                      <FormLabel htmlFor="auto-set-qa-state" className="font-normal">
                        Mark project as Q/A
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />

                </FormItem>
              )}
              />

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending || uploading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={!fileMeta || isPending || uploading}
                  >
                    {(isPending || uploading) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
