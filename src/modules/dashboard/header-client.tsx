"use client"

import { Button } from "@/components/ui/button"
import { Globe, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LoginSection } from "./login-section"
import { UserSectionDropdownMenu } from "./user-section-dropdown-menu"
import { User } from "better-auth"
import { Role } from "@/db/schema"

interface HeaderProps {
    user: User | Role
}

export function HeaderClient({ user } : HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-accent rounded-lg p-2">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">LinguaLink</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            Services
          </Link>
          <Link
            href="/languages"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            Languages
          </Link>
          <Link
            href="/pricing"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            {!user
              ? (
                <LoginSection />
              ) : (
                <UserSectionDropdownMenu user={user as User}/>
              )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
            <Link
              href="/services"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/languages"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Languages
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
