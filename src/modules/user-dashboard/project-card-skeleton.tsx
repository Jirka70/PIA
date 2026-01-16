"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

interface UserProjectSkeletonProps {
  hasReview?: boolean;
}

export const UserProjectSkeleton = ({ hasReview = false }: UserProjectSkeletonProps) => {
  return (
    <Card className="group overflow-hidden animate-pulse">
      <div className="h-1 bg-muted" />
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2"> 
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {hasReview && (
          <div className="pt-4 border-t border-border/50 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-6 border-t border-border/50">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-36" />
        </div>

        <div className="pt-2 border-t border-border/50">
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};
