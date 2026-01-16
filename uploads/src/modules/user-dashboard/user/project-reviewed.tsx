"use client"

import { CheckCircle2, Heart, Sparkles, Star } from "lucide-react"
import { useTranslations } from "next-intl"

export const ProjectReviewed = () => {
  const t = useTranslations("ProjectReviewed")

  const done = 2
  const total = 2

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 p-4 sm:p-5">
      {/* Dekorativní pozadí */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-500/10 rounded-full blur-xl" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Ikona */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse" />
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              {t("title")}
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              {t("badge", { done, total })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Dekorativní srdce */}
        <div className="hidden sm:flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-rose-400/60 fill-rose-400/40 animate-pulse" />
        </div>
      </div>

      {/* Spodní lišta */}
      <div className="relative mt-4 pt-3 border-t border-emerald-500/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          {t("translatorReview")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          {t("companyReview")}
        </span>
      </div>
    </div>
  )
}
