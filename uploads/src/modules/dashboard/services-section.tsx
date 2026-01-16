import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Headphones, Globe, Briefcase, GraduationCap, Scale } from "lucide-react"

const services = [
  {
    icon: FileText,
    title: "Document Translation",
    description:
      "Professional translation of legal, medical, technical, and business documents with certified accuracy.",
    features: ["Legal Documents", "Medical Records", "Technical Manuals", "Certificates"],
    color: "text-primary",
  },
  {
    icon: Headphones,
    title: "Audio & Video Translation",
    description: "Comprehensive multimedia translation including subtitles, dubbing, and voice-over services.",
    features: ["Subtitling", "Voice-over", "Dubbing", "Transcription"],
    color: "text-accent",
  },
  {
    icon: Globe,
    title: "Website Localization",
    description: "Complete website and app localization to reach global markets with cultural adaptation.",
    features: ["UI Translation", "Cultural Adaptation", "SEO Optimization", "Testing"],
    color: "text-primary",
  },
  {
    icon: Briefcase,
    title: "Business Translation",
    description:
      "Specialized business communication translation for contracts, presentations, and marketing materials.",
    features: ["Contracts", "Presentations", "Marketing", "Reports"],
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    title: "Academic Translation",
    description: "Scholarly and academic document translation with subject matter expertise and precision.",
    features: ["Research Papers", "Dissertations", "Transcripts", "Certificates"],
    color: "text-primary",
  },
  {
    icon: Scale,
    title: "Legal Translation",
    description: "Certified legal translation services for courts, law firms, and international legal proceedings.",
    features: ["Court Documents", "Contracts", "Patents", "Immigration"],
    color: "text-accent",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm">Our Services</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            Comprehensive <span className="text-primary">Translation</span> Solutions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            From documents to multimedia, we provide{" "}
            <span className="text-accent font-semibold">expert translation services</span> tailored to your specific
            industry needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 bg-card">
              <CardHeader>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4`}
                >
                  <service.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, featureIndex) => (
                    <Badge key={featureIndex} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
