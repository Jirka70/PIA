"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const ProjectAdminViewSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="w-full h-3 rounded-full" />
        </div>

        <Separator />

        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="bg-muted/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
