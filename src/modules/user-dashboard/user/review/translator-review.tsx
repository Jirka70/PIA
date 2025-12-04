// components/reviews/TranslatorReview.tsx
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


interface TranslatorReviewProps {
  onSubmit: (data: TranslatorFormData & { reviewType: "translator" }) => void
  onCancel: () => Promise<void>
  isSubmitted: boolean
}

export function TranslatorReview({ onSubmit, onCancel, isSubmitted }: TranslatorReviewProps) {
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
      comment: "",
    },
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
              <FormLabel>Jméno překladatele *</FormLabel>
              <FormControl>
                <Input placeholder="Jan Novák" {...field} />
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
                Jazykový pár
              </FormLabel>
              <FormControl>
                <Input placeholder="EN → CZ" {...field} />
              </FormControl>
              <FormDescription>Např. angličtina do češtiny</FormDescription>
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
                <FormLabel className="text-sm text-muted-foreground">Kvalita</FormLabel>
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
                  Komunikace
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
                  Dochvilnost
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
                <FormLabel className="text-base font-medium">Celkové hodnocení *</FormLabel>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <StarRating rating={field.value} onRatingChange={field.onChange} />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value > 0 ? `${field.value}/5` : "Vyberte hodnocení"}
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
                <FormLabel>Titulek recenze *</FormLabel>
                <FormControl>
                  <Input placeholder="Shrňte svou zkušenost jednou větou" {...field} />
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
                <FormLabel>Vaše recenze *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Popište podrobněji svou zkušenost s překladem..." rows={4} {...field} />
                </FormControl>
                <FormDescription>{field.value?.length || 0}/1000 znaků</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Zrušit
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Odesílám..." : "Odeslat recenzi"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
