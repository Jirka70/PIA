"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SubmittedState } from "./submitted-state"
import { CompanyFormData, companySchema } from "@/lib/validators/review-schemas"
import { StarRating } from "./star-rating"
import { useTranslations } from "next-intl"

interface CompanyReviewProps {
  onSubmit: (data: CompanyFormData & { reviewType: "company" }) => void
  onCancel: () => void
  isSubmitted: boolean
}

export function CompanyReview({ onSubmit, onCancel, isSubmitted }: CompanyReviewProps) {
  const t = useTranslations("CompanyReview")

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      priceRating: 0,
      supportRating: 0,
      wouldRecommend: false,
      overallRating: 0,
      title: "",
      comment: ""
    }
  })

  const handleFormSubmit = (data: CompanyFormData) => {
    onSubmit({ ...data, reviewType: "company" })
  }

  if (isSubmitted) {
    return <SubmittedState type="company" />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.companyName.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("fields.companyName.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="priceRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">{t("fields.ratings.priceQuality")}</FormLabel>
                <FormControl>
                  <StarRating rating={field.value || 0} onRatingChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">{t("fields.ratings.support")}</FormLabel>
                <FormControl>
                  <StarRating rating={field.value || 0} onRatingChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="wouldRecommend"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">{t("fields.wouldRecommend.label")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="overallRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">{t("fields.overallRating.label")}</FormLabel>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <StarRating rating={field.value} onRatingChange={field.onChange} />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value > 0 ? `${field.value}/5` : t("fields.overallRating.selectRating")}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.title.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("fields.title.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.comment.label")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("fields.comment.placeholder")} rows={4} {...field} />
                </FormControl>
                <FormDescription>{t("fields.comment.counter", { count: field.value?.length || 0 })}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("actions.submitting") : t("actions.submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
