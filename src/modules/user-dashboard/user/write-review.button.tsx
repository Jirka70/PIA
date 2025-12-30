"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function WriteReviewButton({ className, ...props }: ComponentProps<typeof Button>) {
  const t = useTranslations("WriteReviewButton")

  return (
    <Button
      {...props}
      className={cn(
        `
        gap-2 pl-4 pr-5 py-2
        rounded-xl font-semibold
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        text-white shadow-md hover:shadow-lg
        transition-all duration-200
        hover:brightness-110 active:scale-[0.98]
        `,
        className
      )}
    >
      <Star className="h-4 w-4 fill-yellow-300 text-yellow-300 drop-shadow-sm" />
      {t("label")}
    </Button>
  )
}
