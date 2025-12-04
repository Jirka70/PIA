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

interface ReviewDialogProps {
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  onTranslatorReviewSubmitted: (data: TranslatorFormData) => Promise<void>
  onCompanyReviewSubmitted: (data: CompanyFormData) => Promise<void>
  isTranslatorReviewSubmitted: boolean,
  isCompanyReviewSubmitted: boolean
}

export function ReviewDialog({ isOpen, onOpenChange, onTranslatorReviewSubmitted, onCompanyReviewSubmitted, isTranslatorReviewSubmitted, isCompanyReviewSubmitted }: ReviewDialogProps) {
  const isMobile = useIsMobile()

  const handleCancel = async () => {
    onOpenChange(false)
  }

  const defaultTrigger = <WriteReviewButton />

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{defaultTrigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Napsat recenzi</DrawerTitle>
            <DrawerDescription>Podělte se o svou zkušenost s překladatelskou službou</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            <ReviewForm onTranslatorReviewSubmit={onTranslatorReviewSubmitted} onCompanyReviewSubmi={onCompanyReviewSubmitted} onCancel={handleCancel} translator={isTranslatorReviewSubmitted} company={isCompanyReviewSubmitted}/>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Napsat recenzi</DialogTitle>
          <DialogDescription>Podělte se o svou zkušenost s překladatelskou službou</DialogDescription>
        </DialogHeader>
        <ReviewForm onCompanyReviewSubmi={onCompanyReviewSubmitted} onTranslatorReviewSubmit={onTranslatorReviewSubmitted} onCancel={handleCancel} translator={isTranslatorReviewSubmitted} company={isCompanyReviewSubmitted}/>
      </DialogContent>
    </Dialog>
  )
}
