"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"

export const LoginSection = () => {
    const t = useTranslations("nav")
    return <>
        <Button variant="ghost" size="sm" asChild className="text-sm lg:text-base">
            <Link href="/sign-in">{t("login")}</Link>
        </Button>
        <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm lg:text-base"
            size="sm"
        >
            <Link href="/sign-up">{t("getStarted")}</Link>
        </Button>
    </>
}