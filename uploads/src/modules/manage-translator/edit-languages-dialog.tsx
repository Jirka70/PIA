"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, X } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

interface EditLanguagesDialogProps {
  translatorId: string
  currentLanguages: {
    name: string
    code: string
  }[]
}

export function SelectLanguagesSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center px-2 py-1.5">
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </>
  )
}

export function EditLanguagesDialog({ translatorId, currentLanguages }: EditLanguagesDialogProps) {
  const t = useTranslations("EditLanguagesDialog")

  const [open, setOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const addLanguageMutation = useMutation(
    trpc.languages.addLanguageToTranslator.mutationOptions({
      onSuccess: () => {
        toast.success(t("toasts.addSuccess"))
      },
      onError: (error) => {
        toast.error(error?.message || t("toasts.addError"))
      }
    })
  )

  const removeLanguageMutation = useMutation(
    trpc.languages.removeLanguageOfTranslator.mutationOptions({
      onSuccess: () => {
        toast.success(t("toasts.removeSuccess"))
      },
      onError: (error) => {
        toast.error(error?.message || t("toasts.removeError"))
      }
    })
  )

  const { isPending: languagesPending, data: languages } = useQuery(trpc.languages.getLanguages.queryOptions())

  const getLanguageByName = (name: string) => {
    return languages?.languages.filter((el) => el.name === name)
  }

  const addLanguage = async (languageName: string | undefined) => {
    if (!languageName) {
      toast.error(t("toasts.languageNotFound"))
      return
    }

    const language = getLanguageByName(languageName)?.at(0)
    if (!language) {
      toast.error(t("toasts.languageNotFound"))
      return
    }

    await addLanguageMutation.mutateAsync({
      translatorId,
      code: language.code
    })

    await queryClient.invalidateQueries(
      trpc.users.getTranslatorInfo.queryOptions({
        id: translatorId
      })
    )

    setSelectedLanguage(undefined)
  }

  const removeLanguage = async (languageName: string | undefined) => {
    if (!languageName) {
      toast.error(t("toasts.languageNotFound"))
      return
    }

    const language = getLanguageByName(languageName)?.at(0)
    if (!language) {
      toast.error(t("toasts.languageNotFound"))
      return
    }

    await removeLanguageMutation.mutateAsync({
      translatorId,
      code: language.code
    })

    await queryClient.invalidateQueries(
      trpc.users.getTranslatorInfo.queryOptions({
        id: translatorId
      })
    )

    setSelectedLanguage(undefined)
  }

  const availableLanguages = languages?.languages.filter(
    (lang) => !currentLanguages.some((cl) => cl.code === lang.code)
  )

  const isMutating = addLanguageMutation.isPending || removeLanguageMutation.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          {t("trigger.edit")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("header.title")}</DialogTitle>
          <DialogDescription>{t("header.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("select.placeholder")} />
              </SelectTrigger>

              <SelectContent>
                {languagesPending ? (
                  <SelectLanguagesSkeleton />
                ) : (
                  availableLanguages?.map((language) => (
                    <SelectItem key={language.code} value={language.name}>
                      {language.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              onClick={async () => await addLanguage(selectedLanguage)}
              size="icon"
              disabled={!selectedLanguage || isMutating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentLanguages.map((language) => (
              <Badge key={language.code} variant="secondary" className="gap-2 pr-2 text-sm">
                {language.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={async () => await removeLanguage(language.name)}
                  disabled={isMutating}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          {languages?.languages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">{t("select.empty")}</p>
          )}
        </div>

        <DialogFooter>
          <Button disabled={isMutating} onClick={() => setOpen(false)}>
            {isMutating ? t("actions.proceeding") : t("actions.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
