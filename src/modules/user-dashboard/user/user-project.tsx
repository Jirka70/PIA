"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  Download,
  Calendar,
  CalendarCheck,
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { performDownload } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { StatusBadge } from "@/modules/project-view/status-badge"
import { useState } from "react"
import { ReviewDialog } from "./review/review-dialog"
import { CompanyFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { TranslatorReviewCard } from "./review/translator-review-card"
import { CompanyReviewCard } from "./review/company-review-card"
import { UserProjectViewProps } from "@/modules/project-view/project-view-props"
import { ProjectReviewed } from "./project-reviewed"
import { isActive, isCancelled } from "@/lib/project-status-utils"
import { useLocale, useTranslations } from "next-intl"
import { ChatDialog } from "../chat/chat-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTRPC } from "@/trpc/client"
import { ProjectType } from "@/lib/types/project.type"

interface UserProjectProps {
  projectInfo: UserProjectViewProps
  onTranslatorReviewSubmit: (data: TranslatorFormData, project: ProjectType) => Promise<void>
  onCompanyReviewSubmit: (data: CompanyFormData, project: ProjectType) => Promise<void>
}

type AcceptState = "n/a" | "waiting for approval" | "accepted" | "rejected"

export const UserProject = ({ projectInfo, onTranslatorReviewSubmit, onCompanyReviewSubmit }: UserProjectProps) => {
  const t = useTranslations("UserProject")
  const queryClient = useQueryClient()
  const locale = useLocale()
  const trpc = useTRPC()

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-emerald-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-amber-500"
    return "bg-slate-400"
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return t("notSet")
    const dateObj = typeof date === "string" ? new Date(date) : date

    const resolvedLocale = locale === "cs" ? "cs-CZ" : locale === "en" ? "en-US" : locale

    return dateObj.toLocaleDateString(resolvedLocale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const project = projectInfo.project
  const translatorReview = projectInfo.translatorReview
  const companyReview = projectInfo.companyReview
  const translator = projectInfo.translator
  const sourceFile = projectInfo.sourceFile
  const translatedFile = projectInfo.targetFile

  const downloadTranslatedFile = async () => {
    if (!translatedFile) throw new Error(t("errors.cannotFindFileToDownload"))
    await performDownload(translatedFile)
  }

  const downloadSourceFile = async () => {
    if (!sourceFile) throw new Error(t("errors.cannotFindFileToDownload"))
    await performDownload(sourceFile)
  }

  const { isPending: isDownloadingTranslatedFile } = useMutation({
    mutationFn: downloadTranslatedFile,
    onError: (error) => {
      toast.error((error as Error).message || t("errors.cannotDownloadTranslated"))
    }
  })

  const { isPending: isDownloadingSourceFile } = useMutation({
    mutationFn: downloadSourceFile,
    onError: (error) => {
      toast.error((error as Error).message || t("errors.cannotDownloadSource"))
    }
  })

  const { mutateAsync: changeAcceptState, isPending: isChangingAcceptState } = useMutation(
    trpc.projects.changeAcceptState.mutationOptions({
      onSuccess: () => {
        toast.success("Response was successfully submitted")
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to submit your response")
      }
    })
  )

  // ---------- ACCEPT STATE LOGIC (UPDATED) ----------
  // acceptedState:
  // - "n/a" -> project is in progress, approval is not allowed
  // - "waiting for approval" -> show Accept/Reject and allow decision
  // - "accepted" | "rejected" -> decision made, lock UI
  const acceptedState = project.acceptState as AcceptState
  const isQa = project.status === "QA"

  const canApprove = isQa && acceptedState === "waiting for approval"
  const isDecisionMade = acceptedState === "accepted" || acceptedState === "rejected"
  const isApprovalNotAvailable = acceptedState === "n/a"

  const isQaBusy = isChangingAcceptState

  const updateCachedAcceptedState = (decision: AcceptState) => {
    queryClient.setQueryData(
      trpc.projects.getManyAsUser.queryKey({ userId: project.clientId ?? "" }),
      (cached: any) => {
        if (!cached) return cached
        return {
          ...cached,
          projects: cached.projects.map((entry: any) =>
            entry.project.id === project.id
              ? {
                  ...entry,
                  project: {
                    ...entry.project,
                    acceptState: decision
                  }
                }
              : entry
          )
        }
      }
    )
  }

  const submitQaDecision = async (decision: "accepted" | "rejected") => {
    await changeAcceptState({
      accept: decision,
      projectId: project.id
    })

    // optimistic UI update after successful mutation (keeps you safe from rollback complexity)
    updateCachedAcceptedState(decision)
  }

  const hasTranslatorReview = !!translatorReview
  const hasCompanyReview = !!companyReview
  const hasAnyReview = hasTranslatorReview || hasCompanyReview
  const hasAllReviews = hasTranslatorReview && hasCompanyReview

  const getDeadlineColor = (dueDate: Date | string | null | undefined) => {
    if (!dueDate) return "text-foreground"

    const deadline = typeof dueDate === "string" ? new Date(dueDate) : dueDate
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysRemaining < 0) return "text-red-600 dark:text-red-400 font-semibold"
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400 font-semibold"
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-500 font-semibold"
    return "text-foreground"
  }

  const onTranslatorReviewSubmitWrapper = async (data: TranslatorFormData) => {
    await onTranslatorReviewSubmit(data, project)
  }

  const onCompanyReviewSubmitWrapper = async (data: CompanyFormData) => {
    await onCompanyReviewSubmit(data, project)
  }

  const progressColor = getProgressColor(project.progressPercent)
  const remainingPercent = 100 - project.progressPercent

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors truncate">
                {project.name}
              </CardTitle>

              {isQa && (
                <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  QA
                </Badge>
              )}
            </div>

            <CardDescription className="mt-1.5 text-sm sm:text-base line-clamp-2">{project.description}</CardDescription>
          </div>

          <div className="flex-shrink-0 self-start">
            <StatusBadge status={project.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasAllReviews && <ProjectReviewed />}

        {/* QA approval panel - visible only in QA */}
        {acceptedState !== 'n/a' && (
          <div className="pt-2">
            <Alert className="border-primary/30 bg-primary/5">
              <AlertTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Překlad je hotový a čeká na vaše schválení
              </AlertTitle>

              <AlertDescription className="mt-2 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Zkontrolujte výstupní soubor a dejte nám vědět, zda jste s projektem spokojeni. Schválení projekt uzavře,
                  zamítnutí odešle požadavek na úpravy.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        acceptedState === "accepted"
                          ? "default"
                          : acceptedState === "rejected"
                          ? "destructive"
                          : acceptedState === "waiting for approval"
                          ? "secondary"
                          : "outline"
                      }
                      className="w-fit"
                    >
                      {acceptedState === "accepted" && (
                        <>
                          <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                          Schváleno
                        </>
                      )}
                      {acceptedState === "rejected" && (
                        <>
                          <ThumbsDown className="mr-1 h-3.5 w-3.5" />
                          Zamítnuto
                        </>
                      )}
                      {acceptedState === "waiting for approval" && "Čeká na rozhodnutí"}
                    </Badge>

                    <span className="text-xs text-muted-foreground">
                      {isApprovalNotAvailable
                        ? "Schválení bude dostupné, jakmile bude překlad připraven k zhodnocení."
                        : "Doporučení: stáhněte „Přeložený soubor“ a rychle zkontrolujte klíčové pasáže."}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      disabled={!canApprove || isQaBusy}
                      onClick={async () => {
                        await submitQaDecision("accepted")
                      }}
                      className="min-w-[140px]"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Accept
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canApprove || isQaBusy}
                      onClick={async () => {
                        await submitQaDecision("rejected")
                      }}
                      className="min-w-[140px]"
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>

                {isDecisionMade && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2 text-sm">
                      {acceptedState === "accepted" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          {acceptedState === "accepted" ? "Rozhodnutí bylo zaznamenáno." : "Zpětná vazba byla zaznamenána."}
                        </div>
                        <div className="text-muted-foreground">
                          Pokud potřebujete rozhodnutí změnit, udělejte to prosím přes detail projektu (nebo kontaktujte podporu).
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{t("progress")}</span>
            </div>
            <span className="font-bold text-base tabular-nums">{project.progressPercent}%</span>
          </div>

          <div className="relative w-full bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`${progressColor} rounded-full h-full transition-all duration-500 ease-out relative overflow-hidden`}
              style={{ width: `${project.progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">{t("created")}</span>
              <span className="font-medium truncate">{formatDate(project.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CalendarCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">{t("deadline")}</span>
              <span className={`font-medium truncate ${getDeadlineColor(project.dueAt)}`}>{formatDate(project.dueAt)}</span>
            </div>
          </div>
        </div>

        {hasAnyReview && (
          <div className="pt-4 border-t border-border/50 space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              {t("reviews")}
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {hasTranslatorReview && <TranslatorReviewCard translatorReview={translatorReview} />}
              {hasCompanyReview && <CompanyReviewCard companyReview={companyReview} />}
            </div>
          </div>
        )}

        {(sourceFile || translatedFile) && (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-border/50">
            {sourceFile && (
              <Button
                variant="outline"
                disabled={isDownloadingSourceFile}
                size="sm"
                onClick={async () => {
                  await downloadSourceFile()
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloadingSourceFile ? t("downloads.gettingSource") : t("downloads.downloadSource")}
              </Button>
            )}

            {translatedFile && (
              <Button
                variant="default"
                size="sm"
                disabled={isDownloadingTranslatedFile}
                onClick={async () => {
                  await downloadTranslatedFile()
                }}
                className="flex min-w-[140px] gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloadingTranslatedFile ? t("downloads.gettingTranslated") : t("downloads.translatedFile")}
              </Button>
            )}

            {project.status === "DONE" && (
              <ReviewDialog
                isOpen={isReviewDialogOpen}
                onOpenChange={setIsReviewDialogOpen}
                onTranslatorReviewSubmitted={onTranslatorReviewSubmitWrapper}
                onCompanyReviewSubmitted={onCompanyReviewSubmitWrapper}
                isTranslatorReviewSubmitted={hasTranslatorReview}
                isCompanyReviewSubmitted={hasCompanyReview}
              />
            )}

            {translator && isActive(project.status) && (
              <ChatDialog
                client={{
                  id: translator.id,
                  name: translator.name,
                  email: translator.email,
                  role: translator.role,
                  banned: translator.banned,
                  createdAt: translator.createdAt,
                  emailVerified: translator.emailVerified,
                  image: translator.image,
                  updatedAt: translator.updatedAt
                }}
                triggerLabel={t("contact.trigger")}
                title={t("contact.title")}
                description={t("contact.description")}
                translationNamespace="UserProject.contact"
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xs font-medium text-muted-foreground">
            {project.progressPercent < 100 && !isCancelled(project.status) && (
              <span>{t("statusFooter.remaining", { percent: remainingPercent })}</span>
            )}

            {project.progressPercent === 100 && isActive(project.status) && <span>{t("statusFooter.waitingForReview")}</span>}

            {project.progressPercent === 100 && project.status === "DONE" && (
              <span className="text-emerald-600 dark:text-emerald-400">{t("statusFooter.complete")}</span>
            )}

            {isCancelled(project.status) && <span className="text-red-600 dark:text-red-400">{t("statusFooter.closed")}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
