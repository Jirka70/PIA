"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { useEffect } from "react"

type OptionItem = { value: string; label: string }

export function ContactSection() {
  const locale = useLocale()
  const t = useTranslations("ContactSection")
  const trpc = useTRPC()

  const services = t.raw("services.list") as OptionItem[]

  const contactFormSchema = z
    .object({
      firstName: z.string().min(1, t("form.validation.firstNameRequired")),
      lastName: z.string().min(1, t("form.validation.lastNameRequired")),
      email: z.email(t("form.validation.emailInvalid")),
      sourceLanguage: z.string().min(1, t("form.validation.sourceRequired")),
      targetLanguage: z.string().min(1, t("form.validation.targetRequired")),
      serviceType: z.string().min(1, t("form.validation.serviceRequired")),
      projectDetails: z.string().min(10, t("form.validation.detailsRequired"))
    })
    .refine((data) => data.sourceLanguage !== data.targetLanguage, {
      message: t("form.validation.languagesMustDiffer"),
      path: ["targetLanguage"]
    })

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      sourceLanguage: "",
      targetLanguage: "",
      serviceType: "",
      projectDetails: ""
    }
  })

  const storageKey = `contact-form-${locale}`
  useEffect(() => {
    const raw = typeof window !== "undefined"
      ? localStorage.getItem(storageKey)
      : null

    if (raw) {
      form.reset(JSON.parse(raw))
    }
  }, [storageKey, form])

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (typeof window === "undefined") return
      localStorage.setItem(storageKey, JSON.stringify(values))
    })
    return () => subscription.unsubscribe()
  }, [form, storageKey])

  const languagesQuery = useQuery(trpc.languages.getLanguagesPublic.queryOptions())

  const sendContactMutation = useMutation(
    trpc.emails.send.mutationOptions({
      onSuccess: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(storageKey)
        }
        toast.success(t("form.success"))
        form.reset()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    sendContactMutation.mutate(values)
  }

  const languages = languagesQuery.data?.languages?.map((lang) => ({
    value: lang.code,
    label: lang.name ?? lang.code
  })) as OptionItem[] | undefined

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm">
            {t("badge")}
          </Badge>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            {t("title.prefix")} <span className="text-accent">{t("title.accent")}</span> {t("title.suffix")}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            {t("description.p1")} <span className="text-accent font-semibold">{t("description.freeQuote")}</span>{" "}
            {t("description.p2")}{" "}
            <span className="text-primary font-semibold">{t("description.breakBarriers")}</span>
            {t("description.p3")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-primary">{t("form.cardTitle")}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{t("form.cardDescription")}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t("form.firstNameLabel")}</label>
                      <Input
                        placeholder={t("form.firstNamePlaceholder")}
                        {...form.register("firstName")}
                        aria-invalid={!!form.formState.errors.firstName}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-xs text-red-600">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t("form.lastNameLabel")}</label>
                      <Input
                        placeholder={t("form.lastNamePlaceholder")}
                        {...form.register("lastName")}
                        aria-invalid={!!form.formState.errors.lastName}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-xs text-red-600">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.emailLabel")}</label>
                    <Input
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      {...form.register("email")}
                      aria-invalid={!!form.formState.errors.email}
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t("form.sourceLanguageLabel")}</label>
                      <Select
                        onValueChange={(value) => form.setValue("sourceLanguage", value, { shouldValidate: true })}
                        value={form.watch("sourceLanguage")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("form.languageSelectPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {(languages ?? []).map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.sourceLanguage && (
                        <p className="text-xs text-red-600">{form.formState.errors.sourceLanguage.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t("form.targetLanguageLabel")}</label>
                      <Select
                        onValueChange={(value) => form.setValue("targetLanguage", value, { shouldValidate: true })}
                        value={form.watch("targetLanguage")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("form.languageSelectPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {(languages ?? []).map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.targetLanguage && (
                        <p className="text-xs text-red-600">{form.formState.errors.targetLanguage.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.serviceTypeLabel")}</label>
                    <Select
                      onValueChange={(value) => form.setValue("serviceType", value, { shouldValidate: true })}
                      value={form.watch("serviceType")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.serviceSelectPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.serviceType && (
                      <p className="text-xs text-red-600">{form.formState.errors.serviceType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.projectDetailsLabel")}</label>
                    <Textarea
                      placeholder={t("form.projectDetailsPlaceholder")}
                      className="min-h-[100px] sm:min-h-[120px]"
                      {...form.register("projectDetails")}
                      aria-invalid={!!form.formState.errors.projectDetails}
                    />
                    {form.formState.errors.projectDetails && (
                      <p className="text-xs text-red-600">{form.formState.errors.projectDetails.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-purple border-0 text-sm sm:text-base"
                    disabled={sendContactMutation.isPending}
                  >
                    {sendContactMutation.isPending ? t("form.submitting") : t("form.submitButton")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="grid gap-4 sm:gap-6">
              <Card className="border-2 bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-accent text-accent-foreground rounded-lg p-2 sm:p-3 flex-shrink-0">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{t("infoCards.email.title")}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{t("infoCards.email.value")}</p>
                      <p className="text-xs sm:text-sm text-accent">{t("infoCards.email.hint")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 sm:p-3 flex-shrink-0">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{t("infoCards.phone.title")}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{t("infoCards.phone.value")}</p>
                      <p className="text-xs sm:text-sm text-primary">{t("infoCards.phone.hint")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-accent text-accent-foreground rounded-lg p-2 sm:p-3 flex-shrink-0">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{t("infoCards.visit.title")}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{t("infoCards.visit.line1")}</p>
                      <p className="text-sm sm:text-base text-muted-foreground">{t("infoCards.visit.line2")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 sm:p-3 flex-shrink-0">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{t("infoCards.hours.title")}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{t("infoCards.hours.line1")}</p>
                      <p className="text-sm sm:text-base text-muted-foreground">{t("infoCards.hours.line2")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
