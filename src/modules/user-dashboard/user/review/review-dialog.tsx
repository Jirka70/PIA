"use client"

import type React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { CompanyFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { ReviewForm } from "./review-form"
import { WriteReviewButton } from "../write-review.button"
import { useTranslations } from "next-intl"

interface ReviewDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTranslatorReviewSubmitted: (data: TranslatorFormData) => Promise<void>
  onCompanyReviewSubmitted: (data: CompanyFormData) => Promise<void>
  isTranslatorReviewSubmitted: boolean
  isCompanyReviewSubmitted: boolean
}

export function ReviewDialog({
  isOpen,
  onOpenChange,
  onTranslatorReviewSubmitted,
  onCompanyReviewSubmitted,
  isTranslatorReviewSubmitted,
  isCompanyReviewSubmitted
}: ReviewDialogProps) {
  const t = useTranslations("ReviewDialog")
  const isMobile = useIsMobile()

  const handleCancel = async () => {
    onOpenChange(false)
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <WriteReviewButton />
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerDescription>{t("description")}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            <ReviewForm
              onTranslatorReviewSubmit={onTranslatorReviewSubmitted}
              onCompanyReviewSubmit={onCompanyReviewSubmitted}
              onCancel={handleCancel}
              translator={isTranslatorReviewSubmitted}
              company={isCompanyReviewSubmitted}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <WriteReviewButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <ReviewForm
          onCompanyReviewSubmit={onCompanyReviewSubmitted}
          onTranslatorReviewSubmit={onTranslatorReviewSubmitted}
          onCancel={handleCancel}
          translator={isTranslatorReviewSubmitted}
          company={isCompanyReviewSubmitted}
        />
      </DialogContent>
    </Dialog>
  )
}
