"use client"

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Star, ThumbsUp } from "lucide-react";
import { RatingRow } from "./rating-row";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface CompanyReviewCardProps {
    projectId: string
}

export const CompanyReviewCard = ({ projectId }: CompanyReviewCardProps) => {
    const trpc = useTRPC()

    const { data: companyReview, isPending } = useQuery(trpc.reviews.getCompanyReviewByProjectId.queryOptions({
        id: projectId
    }))

    if (isPending) {
        return <p>Pending</p>
    }

    const review = companyReview?.companyReview;

    if (!review) {
        return <p>Review not found</p>
    }

    return (
    <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-4 space-y-3">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Building2 className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-semibold text-sm">Hodnocení firmy</span>
        </div>
        {review.overallRating && (
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                <Badge variant="secondary" className="gap-1 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {review.overallRating}/5
                </Badge>
                </TooltipTrigger>
                <TooltipContent>Celkové hodnocení</TooltipContent>
            </Tooltip>
            </TooltipProvider>
        )}
        </div>

        <div className="space-y-1.5">
        <RatingRow label="Cena" rating={review.priceRating} />
        <RatingRow label="Podpora" rating={review.supportRating} />
        </div>

        {review.wouldRecommed !== null && (
        <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
            <ThumbsUp className={`w-3.5 h-3.5 ${review.wouldRecommed ? "text-emerald-500" : "text-muted-foreground"}`} />
            <span
                className={`text-xs font-medium ${review.wouldRecommed ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
            >
                {review.wouldRecommed ? "Doporučuje" : "Nedoporučuje"}
            </span>
            </div>
        </div>
        )}
    </div>
    )
}