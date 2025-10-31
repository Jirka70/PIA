"use client"

import type React from "react"

import { useRef } from "react"
import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form"
import { Upload, X, FileIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  label?: string
  accept?: string
  maxSize?: number
  loading?: boolean
  onUpload?: (file: File) => void | Promise<void>
  disabled?: boolean
}

function formatBytesFallback(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function FileUploadField<TFieldValues extends FieldValues>({
  name,
  label = "Translated file",
  accept = ".txt,.pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB default
  loading = false,
  onUpload,
  disabled = false,
}: FileUploadFieldProps<TFieldValues>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control } = useFormContext<TFieldValues>()

  const validateFile = (file: File | null): string | true => {
    if (!file) return true

    // Check file type
    const acceptedTypes = accept.split(",").map((t) => t.trim())
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileExtension === type
      }
      return file.type.match(type.replace("*", ".*"))
    })

    if (!isValidType) {
      return `Neplatný typ souboru. Povolené: ${accept}`
    }

    // Check file size
    if (file.size > maxSize) {
      return `Soubor je příliš velký. Maximum: ${formatBytesFallback(maxSize)}`
    }

    return true
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: validateFile,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const file = value as File | null

        const handleFileChange = (newFile: File | null) => {
          onChange(newFile)
          if (newFile && onUpload) {
            onUpload(newFile)
          }
        }

        const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
          e.preventDefault()
          if (disabled || loading) return

          const droppedFile = e.dataTransfer.files[0]
          if (droppedFile) {
            handleFileChange(droppedFile)
          }
        }

        const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
          e.preventDefault()
        }

        const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFile = e.target.files?.[0] || null
          handleFileChange(selectedFile)
        }

        const handleRemove = () => {
          handleFileChange(null)
          if (inputRef.current) {
            inputRef.current.value = ""
          }
        }

        return (
          <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label}
            </Label>

            {/* Dropzone */}
            <label
              htmlFor={name}
              onDrop={onDrop}
              onDragOver={onDragOver}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3",
                "rounded-xl border border-dashed p-6 sm:p-8 text-center",
                "transition-colors cursor-pointer",
                "hover:border-foreground/30",
                (disabled || loading) && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="pointer-events-none flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 sm:h-10 sm:w-10 opacity-70" />
                <div className="text-sm">
                  <span className="font-medium">Drag file</span> or <span className="underline">choose file</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Allowed: {accept.replaceAll(",", ", ")} · Max {formatBytesFallback(maxSize)}
                </p>
              </div>
              <Input
                ref={inputRef}
                id={name}
                type="file"
                accept={accept}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onInputChange}
                disabled={disabled || loading}
              />
            </label>

            {/* Vybraný soubor */}
            {file && (
              <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon className="h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.type || "neznámý typ"} · {formatBytesFallback(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                  onClick={handleRemove}
                  disabled={disabled || loading}
                  title="Odebrat soubor"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Chyba */}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
          </div>
        )
      }}
    />
  )
}
