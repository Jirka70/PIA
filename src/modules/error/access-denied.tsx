import Link from "next/link"
import { ShieldAlert, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"

export default function AccessDenied() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Empty className="max-w-2xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldAlert className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Access Denied</EmptyTitle>
          <EmptyDescription>
            Nemáš oprávnění k zobrazení této stránky nebo zdroje. Zkontroluj prosím svá práva, případně
            kontaktuj správce nebo se přihlas pod jiným účtem.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href="/user-dashboard">
                <Home />
                Dashboard
              </Link>
            </Button>

            {/* Volitelně: návrat na předchozí stránku jako odkaz na home (bez history.back) */}
            <Button asChild variant="secondary" className="flex-1 sm:flex-none">
              <Link href="/">
                <ArrowLeft />
                Zpět na domov
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  )
}
