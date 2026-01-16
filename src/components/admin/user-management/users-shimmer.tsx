"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface UserShimmerProps {
  /** How many placeholder rows to render */
  rows?: number
  /** Optional className passthrough */
  className?: string
}

/**
 * Skeleton loader that mirrors the layout of UsersManagement.
 * Show this while the TRPC users query is pending.
 */
export function UserShimmer({ rows = 5, className }: UserShimmerProps) {
  return (
    <Card className={cn("bg-card/50 backdrop-blur-md border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-40" />
            </div>
            <CardDescription>
              <Skeleton className="mt-2 h-4 w-56" />
            </CardDescription>
          </div>
          <Button size="sm" disabled>
            <Skeleton className="h-4 w-24" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Projects</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  {/* User cell */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </TableCell>

                  {/* Role badge */}
                  <TableCell>
                    <div className="inline-flex items-center gap-2 rounded-full border px-2 py-1">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </TableCell>

                  {/* Status badge */}
                  <TableCell>
                    <div className="inline-flex items-center gap-2 rounded-full border px-2 py-1">
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </TableCell>

                  {/* Projects number */}
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-10" />
                  </TableCell>

                  {/* Actions menu button */}
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserShimmer
