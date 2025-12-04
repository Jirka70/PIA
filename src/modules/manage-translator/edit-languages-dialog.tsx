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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, X } from 'lucide-react'
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


interface EditLanguagesDialogProps {
  translatorId: string
  currentLanguages: {
    name: string,
    code: string
  }[]
}

import { Skeleton } from "@/components/ui/skeleton";



export function SelectLanguagesSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center px-2 py-1.5"
        >
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </>
  );
}


export function EditLanguagesDialog({ translatorId, currentLanguages }: EditLanguagesDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>()
  const trpc = useTRPC()
  const queryClient = useQueryClient()


  const addLanguageMutation = useMutation(trpc.languages.addLanguageToTranslator.mutationOptions({
    onSuccess: () => {
      toast.success("Language was successfully added to translator")
    },
    onError: (error) => {
      toast.error(error?.message || "Language cannot be set to translator")
    }
  }))

  const removeLanguageMutation = useMutation(trpc.languages.removeLanguageOfTranslator.mutationOptions({
    onSuccess: () => {
      toast.success("Language was successfully removed from translator")
    },
    onError: (error) => {
      toast.error(error?.message || "Language cannot be removed to translator")
    }
  }))

  const { isPending: languagesPending, data: languages } = useQuery(trpc.languages.getLanguages.queryOptions())


  const getLanguageByCode = (name: string) => {
    return languages?.languages.filter((el) => el.name === name);
  }

  const addLanguage = async (languageName: string | undefined) => {
      if (!languageName) {
        toast.error("Language was not found")
        return;
      }
      const language = getLanguageByCode(languageName)?.at(0)

      if (!language) {
        toast.error("Language was not found")
        return;
      }

      await addLanguageMutation.mutateAsync({
        translatorId,
        code: language.code,
      })

      queryClient.invalidateQueries(trpc.users.getTranslatorInfo.queryOptions({
        id: translatorId
      }))

      setSelectedLanguage(undefined)
  }

  const removeLanguage = async (languageName: string | undefined) => {
    if (!languageName) {
      toast.error("Language was not found")
      return;
    }

    const language = getLanguageByCode(languageName)?.at(0)

    if (!language) {
      toast.error("Language was not found")
      return;
    }

    await removeLanguageMutation.mutateAsync({
      translatorId,
      code: language.code
    })

    queryClient.invalidateQueries(trpc.users.getTranslatorInfo.queryOptions({
        id: translatorId
      }))

    setSelectedLanguage(undefined)
  }

  const availableLanguages = languages?.languages.filter((lang) => !currentLanguages.some((cl) => cl.code === lang.code))


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Upravit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upravit jazyky</DialogTitle>
          <DialogDescription>
            Přidejte nebo odeberte jazyky, které překladatel ovládá
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Vyberte jazyk" />
              </SelectTrigger>
              <SelectContent>
                {languagesPending 
                  ? <SelectLanguagesSkeleton /> 
                  : (
                    availableLanguages?.map((language) => (
                      <SelectItem key={language.code} value={language.name}>
                        {language.name}
                      </SelectItem>
                  )))}
              </SelectContent>
            </Select>
            <Button onClick={async () => { await addLanguage(selectedLanguage)}} size="icon" disabled={!selectedLanguage || addLanguageMutation.isPending || removeLanguageMutation.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {
              currentLanguages.map((language) => (
                <Badge
                  key={language.code}
                  variant="secondary"
                  className="gap-2 pr-2 text-sm"
                >
                  {language.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={async () => { await removeLanguage(language.name)}}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            }
          </div>
          {languages?.languages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Žádné jazyky nejsou přidány
            </p>
          )}
        </div>
        <DialogFooter>
          <Button disabled={addLanguageMutation.isPending || removeLanguageMutation.isPending} onClick={() => setOpen(false)}>
            {addLanguageMutation.isPending || removeLanguageMutation.isPending ? "Proceeding..." : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
