"use client"

import { Button } from "@/components/ui/button"
import { Globe, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {Link} from '@/i18n/navigation';
import { UserSectionDropdownMenu } from "./user-section-dropdown-menu"
import { LoginSection } from "./login-section"
import { User } from "better-auth"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./language-switcher"

interface Props {
  user: User
}

export function HeaderClient({ user } : Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = useTranslations("nav")


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
            {t("home")}
          </Link>
          <Link
            href="/services"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            {t("services")}
          </Link>
          <Link
            href="/languages"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            {t("languages")}
          </Link>
          <Link
            href="/pricing"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/contact"
            className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-colors"
          >
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <UserSectionDropdownMenu username={user.name} />
            ) : (
              <LoginSection />
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
              {t("services")}
            </Link>
            <Link
              href="/languages"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("languages")}
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("pricing")}
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("contact")}
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/register">{t("getStarted")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
