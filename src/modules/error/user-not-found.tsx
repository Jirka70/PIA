import Link from "next/link"
import { UserX, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"

export default function UserNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Empty className="max-w-2xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserX className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Překladatel nebyl nalezen</EmptyTitle>
          <EmptyDescription>
            Požadovaný uživatel neexistuje nebo byl odstraněn. Je možné, že odkaz je neplatný,
            případně uživatel nemá k dispozici žádná data.
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
