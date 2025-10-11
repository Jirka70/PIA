import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm">Get In Touch</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance px-4">
            Ready to Start Your <span className="text-accent">Translation</span> Project?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
            Get a <span className="text-accent font-semibold">free quote</span> within 30 minutes. Our experts are ready
            to help you <span className="text-primary font-semibold">break language barriers</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-primary">Get Free Quote</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Fill out the form and we'll get back to you within 30 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="john@company.com" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Source Language</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Target Language</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Service Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document Translation</SelectItem>
                      <SelectItem value="website">Website Localization</SelectItem>
                      <SelectItem value="audio">Audio/Video Translation</SelectItem>
                      <SelectItem value="legal">Legal Translation</SelectItem>
                      <SelectItem value="medical">Medical Translation</SelectItem>
                      <SelectItem value="technical">Technical Translation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Project Details</label>
                  <Textarea
                    placeholder="Tell us about your project, word count, deadline, and any special requirements..."
                    className="min-h-[100px] sm:min-h-[120px]"
                  />
                </div>

                <Button className="w-full gradient-purple border-0 text-sm sm:text-base">
                  Get Free Quote
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
                      <h3 className="font-semibold text-base sm:text-lg">Email Us</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">hello@lingualink.com</p>
                      <p className="text-xs sm:text-sm text-accent">Response within 30 minutes</p>
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
                      <h3 className="font-semibold text-base sm:text-lg">Call Us</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-xs sm:text-sm text-primary">24/7 Support Available</p>
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
                      <h3 className="font-semibold text-base sm:text-lg">Visit Us</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">123 Translation Ave</p>
                      <p className="text-sm sm:text-base text-muted-foreground">New York, NY 10001</p>
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
                      <h3 className="font-semibold text-base sm:text-lg">Business Hours</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">Mon-Fri: 8AM - 8PM EST</p>
                      <p className="text-sm sm:text-base text-muted-foreground">Weekend: 10AM - 6PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50 border-2">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary">Need Urgent Translation?</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Our rush service can deliver your translation in as little as 12 hours.
                </p>
                <Button
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-white bg-transparent w-full sm:w-auto"
                >
                  Request Rush Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
