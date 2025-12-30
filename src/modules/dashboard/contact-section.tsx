"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

type OptionItem = { value: string; label: string }

export function ContactSection() {
  const t = useTranslations("ContactSection")

  const languages = t.raw("languages.list") as OptionItem[]
  const services = t.raw("services.list") as OptionItem[]

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.firstNameLabel")}</label>
                    <Input placeholder={t("form.firstNamePlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.lastNameLabel")}</label>
                    <Input placeholder={t("form.lastNamePlaceholder")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">{t("form.emailLabel")}</label>
                  <Input type="email" placeholder={t("form.emailPlaceholder")} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.sourceLanguageLabel")}</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.languageSelectPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">{t("form.targetLanguageLabel")}</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.languageSelectPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">{t("form.serviceTypeLabel")}</label>
                  <Select>
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
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">{t("form.projectDetailsLabel")}</label>
                  <Textarea
                    placeholder={t("form.projectDetailsPlaceholder")}
                    className="min-h-[100px] sm:min-h-[120px]"
                  />
                </div>

                <Button className="w-full gradient-purple border-0 text-sm sm:text-base">
                  {t("form.submitButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
