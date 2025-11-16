import Link from "next/link"
import { Users, Home, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

export default function UsersNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Empty className="max-w-2xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No Users Found</EmptyTitle>
          <EmptyDescription>
            We couldn't find any users. Try adjusting your filters or create a new user to get started.
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
              <Link href="/users/new">
                <UserPlus />
                Add User
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  )
}
