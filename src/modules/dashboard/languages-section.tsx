"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"

type LanguageItem = {
  name: string
  code: string
  speakers: string
  color: string
}

export function LanguagesSection() {
  const t = useTranslations("LanguagesSection")

  const languages = t.raw("languages.list") as LanguageItem[]
  const specializations = t.raw("specializations.list") as string[]

  const moreCount = 100 - languages.length

  return (
    <section id="languages" className="py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
            {t("badge")}
          </Badge>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            <span className="text-primary">{t("title.part1")}</span>{" "}
            {t("title.part2")} <span className="text-accent">{t("title.accent")}</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            {t("description.p1")}{" "}
            <span className="text-primary font-semibold">{t("description.certified")}</span>{" "}
            {t("description.p2")}{" "}
            <span className="text-accent font-semibold">{t("description.culturallyAccurate")}</span>{" "}
            {t("description.p3")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-primary">
              {t("popularLanguages")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {languages.map((language, index) => (
                <Card key={index} className="group hover:shadow-md transition-all duration-300 border-2 bg-card">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`${language.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <span className="text-white font-bold text-xs sm:text-sm">{language.code}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                          {language.name}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {language.speakers} {t("speakersLabel")}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <Badge variant="outline" className="text-accent border-accent text-xs sm:text-sm">
                {t("moreLanguagesBadge", { count: moreCount })}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-accent">
              {t("industrySpecializations")}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {specializations.map((spec, index) => (
                <Card key={index} className="group hover:shadow-md transition-all duration-300 border-2 bg-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base group-hover:text-accent transition-colors">
                        {spec}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 sm:mt-8 bg-muted/50 border-2">
              <CardContent className="p-4 sm:p-6 text-center">
                <h4 className="font-bold text-base sm:text-lg mb-2 text-primary">
                  {t("needSpecificLanguageTitle")}
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {t("needSpecificLanguageDescription")}
                </p>
                <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm">
                  {t("contactBadge")}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
