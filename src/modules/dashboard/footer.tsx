import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="bg-accent rounded-lg p-2">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold">LinguaLink</span>
            </Link>
            <p className="text-sm sm:text-base text-background/70 leading-relaxed">
              Breaking language barriers with expert translation services. Connecting businesses and individuals across
              cultures worldwide.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-background/70 hover:text-background hover:bg-background/10 h-9 w-9 sm:h-10 sm:w-10"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-background/70 hover:text-background hover:bg-background/10 h-9 w-9 sm:h-10 sm:w-10"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-background/70 hover:text-background hover:bg-background/10 h-9 w-9 sm:h-10 sm:w-10"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-background/70 hover:text-background hover:bg-background/10 h-9 w-9 sm:h-10 sm:w-10"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Document Translation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Website Localization
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Audio & Video Translation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Legal Translation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Medical Translation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Technical Translation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Certifications
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm sm:text-base text-background/70 hover:text-background transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Stay Updated</h3>
            <p className="text-sm sm:text-base text-background/70 mb-4">
              Get translation tips and industry insights delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 text-sm sm:text-base"
              />
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base">
                Subscribe
              </Button>
            </div>

            <div className="mt-6 sm:mt-8 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-background/70">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="break-all">hello@lingualink.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-background/70">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-background/70">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                New York, NY 10001
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-xs sm:text-sm text-center md:text-left">
            © 2025 LinguaLink. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="#" className="text-background/70 hover:text-background transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="text-background/70 hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-background/70 hover:text-background transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
