"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Languages, Clock, MessageSquare } from "lucide-react"
import { TranslatorFormData, translatorSchema } from "@/lib/validators/review-schemas"
import { SubmittedState } from "./submitted-state"
import { StarRating } from "./star-rating"
import { useTranslations } from "next-intl"

interface TranslatorReviewProps {
  onSubmit: (data: TranslatorFormData & { reviewType: "translator" }) => void
  onCancel: () => Promise<void>
  isSubmitted: boolean
}

export function TranslatorReview({ onSubmit, onCancel, isSubmitted }: TranslatorReviewProps) {
  const t = useTranslations("TranslatorReview")

  const form = useForm<TranslatorFormData>({
    resolver: zodResolver(translatorSchema),
    defaultValues: {
      translatorName: "",
      languagePair: "",
      qualityRating: 0,
      communicationRating: 0,
      punctualityRating: 0,
      overallRating: 0,
      title: "",
      comment: ""
    }
  })

  const handleFormSubmit = async (data: TranslatorFormData) => {
    await onSubmit({ ...data, reviewType: "translator" })
  }

  if (isSubmitted) {
    return <SubmittedState type="translator" />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="translatorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.translatorName.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("fields.translatorName.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languagePair"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t("fields.languagePair.label")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("fields.languagePair.placeholder")} {...field} />
              </FormControl>
              <FormDescription>{t("fields.languagePair.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="qualityRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">{t("fields.ratings.quality")}</FormLabel>
                <FormControl>
                  <StarRating rating={field.value || 0} onRatingChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {t("fields.ratings.communication")}
                </FormLabel>
                <FormControl>
                  <StarRating rating={field.value || 0} onRatingChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="punctualityRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t("fields.ratings.punctuality")}
                </FormLabel>
                <FormControl>
                  <StarRating rating={field.value || 0} onRatingChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
