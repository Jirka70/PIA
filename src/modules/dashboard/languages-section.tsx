import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const languages = [
  { name: "English", code: "EN", speakers: "1.5B+", color: "bg-blue-500" },
  { name: "Spanish", code: "ES", speakers: "500M+", color: "bg-red-500" },
  { name: "French", code: "FR", speakers: "280M+", color: "bg-indigo-500" },
  { name: "German", code: "DE", speakers: "100M+", color: "bg-amber-500" },
  { name: "Chinese", code: "ZH", speakers: "1.1B+", color: "bg-rose-500" },
  { name: "Japanese", code: "JA", speakers: "125M+", color: "bg-pink-500" },
  { name: "Korean", code: "KO", speakers: "77M+", color: "bg-cyan-500" },
  { name: "Arabic", code: "AR", speakers: "400M+", color: "bg-emerald-500" },
  { name: "Portuguese", code: "PT", speakers: "260M+", color: "bg-green-500" },
  { name: "Italian", code: "IT", speakers: "65M+", color: "bg-lime-500" },
  { name: "Russian", code: "RU", speakers: "150M+", color: "bg-violet-500" },
  { name: "Dutch", code: "NL", speakers: "24M+", color: "bg-orange-500" },
]

const specializations = [
  "Medical & Healthcare",
  "Legal & Compliance",
  "Technical & Engineering",
  "Financial Services",
  "Marketing & Advertising",
  "Academic & Research",
]

export function LanguagesSection() {
  return (
    <section id="languages" className="py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
            Languages & Expertise
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            <span className="text-primary">100+ Languages</span> with Industry{" "}
            <span className="text-accent">Expertise</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            Our <span className="text-primary font-semibold">certified translators</span> specialize in various
            industries and deliver <span className="text-accent font-semibold">culturally accurate</span> translations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-primary">Popular Languages</h3>
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
                        <div className="text-xs sm:text-sm text-muted-foreground">{language.speakers} speakers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <Badge variant="outline" className="text-accent border-accent text-xs sm:text-sm">
                + 88 more languages available
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-accent">Industry Specializations</h3>
            <div className="space-y-3 sm:space-y-4">
              {specializations.map((spec, index) => (
                <Card key={index} className="group hover:shadow-md transition-all duration-300 border-2 bg-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
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
                <h4 className="font-bold text-base sm:text-lg mb-2 text-primary">Need a specific language?</h4>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  We work with native speakers and certified translators worldwide.
                </p>
                <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm">
                  Contact us for custom requirements
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
