import { HeroSection } from "@/modules/dashboard/hero-section"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { TestimonialsSection } from "@/modules/dashboard/testimonials-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* Quick Features Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:bg-card/70">
              <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">100+ Languages</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Access professional translation services in over 100 languages worldwide.
              </p>
              <Button variant="link" className="mt-4 p-0 h-auto text-accent" asChild>
                <Link href="/about">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:bg-card/70">
              <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Certified Quality</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                ISO-certified translators ensuring accuracy and cultural authenticity.
              </p>
              <Button variant="link" className="mt-4 p-0 h-auto text-accent" asChild>
                <Link href="/about">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:bg-card/70">
              <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Fast Turnaround</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Get your translations delivered quickly without compromising quality.
              </p>
              <Button variant="link" className="mt-4 p-0 h-auto text-accent" asChild>
                <Link href="/pricing">
                  View pricing <ArrowRight className="ml-2 h-4 w-4" />
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
              Ready to Break Language Barriers?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto text-pretty">
              Join thousands of businesses and individuals who trust LinguaLink for their translation needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent-foreground/20 hover:bg-accent-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      

    </main>
  )
}
