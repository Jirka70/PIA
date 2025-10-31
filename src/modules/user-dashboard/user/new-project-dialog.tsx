"use client"

import type React from "react"
import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Upload, X } from "lucide-react"
import { User } from "better-auth"
import { CreateProjectFormInput, createProjectInput } from "@/lib/validators/create-project-schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon } from "lucide-react";
import { cn, uploadFile } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
]

interface NewDialogProps {
  user: User
}

export function NewProjectDialog({ user } : NewDialogProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient();

  const form = useForm<CreateProjectFormInput>({
    resolver: zodResolver(createProjectInput),
    defaultValues: {
      name: "",
      description: "",
    }
  })

  const trpc = useTRPC()
  const { mutateAsync: createProject, isPending } = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: () => {
      toast.success("Project was successfully created")
      form.reset()
      setOpen(false)
      queryClient.invalidateQueries(trpc.projects.getManyAsUser.queryOptions({
        userId: user.id
      }));
      
    },
    onError: (err) => {
      toast.error(err.message)
      setOpen(false)
    }
  }))

  function removeFile() {
    form.setValue("file", undefined as any, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    toast.info("File removed");
  }

  async function handleFileUpload(file: File) {
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

  const onSubmit = async (data: CreateProjectFormInput) => {
    await createProject({
      ...data,
    })
  }
  const minDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const fileMeta = form.watch("file")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent
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
          <DialogTitle>Create New Translation Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new translation project.
          </DialogDescription>
        </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Legal Contract Translation" {...field} />
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
                <FormLabel>Target Language</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
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
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Provide details about the content, context and any specific requirements..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                        <span>{format(field.value as Date, "d. MMMM yyyy", { locale: cs })}</span>
                        ) : (
                        <span>Vyberte datum</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value as Date}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) => date < minDate}
                    fixedWeeks
                    showOutsideDays
                    numberOfMonths={1}
                  />
                  </PopoverContent>
                </Popover>
                <FormMessage /> 
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Source file</FormLabel>
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
                          if (f) {
                            await handleFileUpload(f)
                          }
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
                            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" /> Upload
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
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">PDF, DOC, DOCX nebo TXT. Max ~20 MB.</p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>
      </DialogContent>    
    </Dialog>
  )
}
