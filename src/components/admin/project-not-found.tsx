import Link from "next/link"
import { FolderX, Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Empty className="max-w-2xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderX className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Project Not Found</EmptyTitle>
          <EmptyDescription>
            We couldn’t locate this project. It may have been deleted or doesn’t exist. 
            You can go back to the dashboard or create a new one.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href="/projects">
                <Home />
                Projects Dashboard
              </Link>
            </Button>
            <Button asChild variant="secondary" className="flex-1 sm:flex-none">
              <Link href="/projects/new">
                <Plus />
                Create Project
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  )
}
