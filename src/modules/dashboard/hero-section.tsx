import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Globe, Users, Zap } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export async function HeroSection() {
  const t = await getTranslations("hero")

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 w-fit text-xs sm:text-sm">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {t("badge")}
            </Badge>

            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                {t("title1")}{" "}
                <span className="text-accent">{t("title2")}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
                {t("description1")}{" "}
                <span className="text-primary font-semibold">{t("description2")}</span> {t("description3")}
                <span className="text-accent font-semibold">{t("description4")}</span> {t("description5")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
              >
                <Link href="/get-quote">
                  {t("getFreeQuote")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                {t("viewWork")}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">{t("support247")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">{t("isoCertified")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">{t("fastDelivery")}</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold">{t("translationProgress")}</h3>
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs sm:text-sm">
                    +150%
                  </Badge>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="opacity-90">{t("documentsTranslated")}</span>
                    <span className="font-semibold">2,500+</span>
                  </div>
                  <div className="w-full bg-primary-foreground/20 rounded-full h-2">
                    <div className="bg-primary-foreground rounded-full h-2 w-4/5"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
                  <div className="text-center">
                    <Globe className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-80" />
                    <div className="text-xl sm:text-2xl font-bold">100+</div>
                    <div className="text-[10px] sm:text-xs opacity-80">{t("languages")}</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-80" />
                    <div className="text-xl sm:text-2xl font-bold">500+</div>
                    <div className="text-[10px] sm:text-xs opacity-80">{t("translators")}</div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-80" />
                    <div className="text-xl sm:text-2xl font-bold">99.9%</div>
                    <div className="text-[10px] sm:text-xs opacity-80">{t("accuracy")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
