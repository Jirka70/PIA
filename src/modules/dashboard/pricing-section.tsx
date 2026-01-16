import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"

const plans = [
  {
    name: "Standard",
    description: "Perfect for individuals and small businesses",
    price: "$0.12",
    unit: "per word",
    icon: Check,
    features: [
      "Professional translators",
      "48-72 hour delivery",
      "Basic quality assurance",
      "Email support",
      "Common language pairs",
      "Standard formatting",
    ],
    popular: false,
    color: "border-border",
  },
  {
    name: "Professional",
    description: "Ideal for businesses requiring certified translations",
    price: "$0.18",
    unit: "per word",
    icon: Star,
    features: [
      "Certified translators",
      "24-48 hour delivery",
      "Advanced quality assurance",
      "Priority support",
      "All language pairs",
      "Professional formatting",
      "Revision included",
      "Industry specialization",
    ],
    popular: true,
    color: "border-primary",
  },
  {
    name: "Enterprise",
    description: "For large organizations with ongoing translation needs",
    price: "Custom",
    unit: "pricing",
    icon: Crown,
    features: [
      "Dedicated project manager",
      "Rush delivery (12-24h)",
      "Premium quality assurance",
      "24/7 phone support",
      "All languages & dialects",
      "Custom formatting",
      "Unlimited revisions",
      "API integration",
      "Volume discounts",
      "SLA guarantee",
    ],
    popular: false,
    color: "border-accent",
  },
]

const additionalServices = [
  { service: "Rush Delivery (24h)", price: "+50%" },
  { service: "Certified Translation", price: "+$25" },
  { service: "Notarization", price: "+$35" },
  { service: "Desktop Publishing", price: "$45/page" },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
            Transparent Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            Choose Your <span className="text-primary">Translation</span> Plan
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            <span className="text-accent font-semibold">Competitive rates</span> with no hidden fees. Get{" "}
            <span className="text-primary font-semibold">professional quality</span> at every price point.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.color} ${plan.popular ? "ring-2 ring-primary shadow-lg lg:scale-105" : ""} transition-all duration-300 hover:shadow-lg bg-card`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${plan.popular ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"} flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="pt-4">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{plan.price}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{plan.unit}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50 border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl text-primary">Additional Services</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enhance your translation project with our premium add-ons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {additionalServices.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg">
                  <span className="font-medium text-xs sm:text-sm">{item.service}</span>
                  <Badge variant="outline" className="text-accent border-accent text-xs">
                    {item.price}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
