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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils" // pokud formatBytes nemáš, níže je fallback
import { Upload, X, Loader2, File as FileIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { uploadedFileMeta, UploadedFileMeta } from "@/lib/validators/uploaded-file-meta"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileUploadField } from "../file-upload-field"

type UploadTranslatedFileDialogProps = {
  /** Tlačítko (nebo cokoliv) které otevře dialog */
  trigger?: React.ReactNode
  /** Volá se po potvrzení – sem si napojíš vlastní upload logiku */
  onConfirm: (file: File) => Promise<void> | void
  /** Ovládání otevření zvenku (není nutné) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Povolené typy souborů */
  accept?: string
  /** Max velikost v bajtech (default ~50 MB) */
  maxSize?: number
  /** Zobrazený nadpis/dialog copy */
  title?: string
  description?: string
  /** Volitelný loading stav z rodiče (když chceš řídit zvenku) */
  loading?: boolean
}

/** Pokud nemáš vlastní utilitu formatBytes, můžeš použít tuto */
function formatBytesFallback(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const MAX_SIZE = 20_000_000;


export function UploadTranslatedFileDialog({
  trigger,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
  accept = ".pdf,.doc,.docx,.txt",
  maxSize = 50 * 1024 * 1024,
  title = "Nahrát přeložený soubor",
  description = "Přetáhněte soubor sem nebo klikněte pro výběr. Podporujeme PDF, DOC(X), TXT",
  loading: loadingProp,
}: UploadTranslatedFileDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : open

  const [file, setFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loadingLocal, setLoadingLocal] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const loading = loadingProp ?? loadingLocal

  const form = useForm<UploadedFileMeta>({
    resolver: zodResolver(uploadedFileMeta)
  })


  const handleOpenChange = (v: boolean) => {
    if (!isControlled) setOpen(v)
    onOpenChange?.(v)
    if (!v) {
      setFile(null)
      setError(null)
      if (inputRef.current) inputRef.current.value = ""
    }
  }



  function validateAndSet(f: File) {
    setError(null)
    if (maxSize && f.size > maxSize) {
      setError(`Soubor je příliš velký (max ${formatBytesFallback(maxSize)})`)
      setFile(null)
      return
    }
    if (accept) {
      const allowed = accept.split(",").map((s) => s.trim().toLowerCase())
      const ext = "." + (f.name.split(".").pop() || "").toLowerCase()
      const typeOk =
        allowed.includes(ext) ||
        allowed.includes(f.type.toLowerCase()) ||
        allowed.includes("*/*") // kdyby někdo povolil vše
      if (!typeOk) {
        setError(`Nepodporovaný typ souboru. Povolené: ${accept}`)
        setFile(null)
        return
      }
    }
    setFile(f)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files?.[0]
    if (f) validateAndSet(f)
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    const f = e.dataTransfer.files?.[0]
    if (f) validateAndSet(f)
  }

  function onDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
  }

  async function handleConfirm() {
    if (!file || loading) return
    try {
      setLoadingLocal(true)
      await onConfirm(file) // napoj si vlastní upload logiku
      handleOpenChange(false)
    } finally {
      setLoadingLocal(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload translated file
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className={cn(
          "sm:max-w-[560px] w-[95%] max-h-[90vh] overflow-y-auto rounded-2xl",
          "p-6 sm:p-8 bg-background"
        )}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FileUploadField name="file" />
      </DialogContent>
    </Dialog>
  )
}
