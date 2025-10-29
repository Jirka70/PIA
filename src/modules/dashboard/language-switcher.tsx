"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import {usePathname, useRouter} from '@/i18n/navigation';
import {useParams, useSearchParams} from 'next/navigation';


const languageFlags = {
  en: "🇬🇧",
  cs: "🇨🇿",
};

const languageNames = {
  en: "English",
  cs: "Čeština",
};

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const search = useSearchParams();
  const params = useParams(); // pro zjištění aktuálního jazyka

  const currentLocale = (params?.locale as "en" | "cs") || "en";

  function switchTo(locale: "en" | "cs") {
    if (locale === currentLocale) return; // když už jsi v tom jazyce, nic nedělej

    const query = search.size ? `?${search.toString()}` : "";
    router.replace(pathname + query, { locale });
  }


    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {(["cs", "en"] as const).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchTo(lang)}
            className={lang === currentLocale ? "bg-accent text-accent-foreground" : ""}
          >
            <span className="mr-2">{languageFlags[lang]}</span>
            {languageNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
