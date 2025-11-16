import Link from "next/link"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Empty className="max-w-2xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Project Not Found</EmptyTitle>
          <EmptyDescription>
            The project you are looking for does not exist or has been removed. Please check the project ID or return to
            the dashboard.
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
          </div>
        </EmptyContent>
      </Empty>
    </main>
  )
}
