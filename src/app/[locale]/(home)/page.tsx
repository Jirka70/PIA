import { HeroSection } from "@/modules/dashboard/hero-section"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { TestimonialsSection } from "@/modules/dashboard/testimonials-section"
import { getTranslations } from "next-intl/server"

export default async function HomePage() {
  const t = await getTranslations("hero")
  const navT = await getTranslations("nav")

  return (
    <main>
      <HeroSection />

      {/* Quick Features Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* Feature 1 */}
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:bg-card/70">
              <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                100+ {t("languages")}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("whyChooseUsDesc")}
              </p>
              <Button variant="link" className="mt-4 p-0 h-auto text-accent" asChild>
                <Link href="/about">
                  {t("learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Feature 2 */}
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:bg-card/70">
              <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                {t("certifiedQuality")}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("certifiedQualityDesc")}
              </p>
              <Button variant="link" className="mt-4 p-0 h-auto text-accent" asChild>
                <Link href="/about">
                  {t("learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Feature 3 */}
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:bg-card/70">
              <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                {t("fastTurnaround")}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("fastTurnaroundDesc")}
              </p>
              <Button variant="link" className="mt-4 p-0 h-auto text-accent" asChild>
                <Link href="/pricing">
                  {navT("pricing")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-accent/90 backdrop-blur-md rounded-2xl p-8 sm:p-12 md:p-16 text-center shadow-xl border border-accent/20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-accent-foreground text-balance">
              {t("title1")} {t("title2")}?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto text-pretty">
              {t("whyChooseUsDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">{navT("getStarted")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent-foreground/20 hover:bg-accent-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/contact">{navT("contact")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
