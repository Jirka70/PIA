import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "André Chernozem",
    role: "International Business Manager",
    company: "TechGlobal Inc.",
    content:
      "LinguaLink transformed our global expansion. Their technical translations are incredibly accurate and culturally appropriate. The team understood our industry-specific terminology perfectly.",
    rating: 5,
    avatar: "/professional-woman-diverse.png",
  },
  {
    name: "Dr. Miguel Rodriguez",
    role: "Medical Director",
    company: "HealthCare International",
    content:
      "As a medical professional, accuracy is paramount. LinguaLink's certified medical translators delivered flawless translations of our research papers and patient documentation.",
    rating: 5,
    avatar: "/doctor-man.png",
  },
  {
    name: "Emma Thompson",
    role: "Legal Counsel",
    company: "Thompson & Associates",
    content:
      "The legal translation services exceeded our expectations. Complex contracts were translated with precision, maintaining all legal nuances. Highly recommended for legal firms.",
    rating: 5,
    avatar: "/lawyer-woman.jpg",
  },
  {
    name: "Hiroshi Tanaka",
    role: "Marketing Director",
    company: "Sakura Brands",
    content:
      "Our marketing campaigns needed cultural adaptation, not just translation. LinguaLink's localization expertise helped us connect authentically with local markets.",
    rating: 5,
    avatar: "/asian-businessman-portrait.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm">
            Client Success Stories
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            Trusted by <span className="text-primary">Professionals</span> Worldwide
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            See how our <span className="text-accent font-semibold">expert translation services</span> have helped
            businesses achieve <span className="text-primary font-semibold">global success</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 bg-card">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-accent text-accent" />
                    ))}
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-6">
                      {testimonial.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t">
                    <img
                      src={testimonial.avatar || "/placeholder.svg?height=48&width=48"}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs sm:text-sm text-accent font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Card className="bg-primary text-primary-foreground border-0 max-w-4xl mx-auto">
            <CardContent className="p-8 sm:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">10,000+</div>
                  <div className="text-xs sm:text-sm opacity-90">Projects Completed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">500+</div>
                  <div className="text-xs sm:text-sm opacity-90">Expert Translators</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">100+</div>
                  <div className="text-xs sm:text-sm opacity-90">Languages Supported</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-xs sm:text-sm opacity-90">Client Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
