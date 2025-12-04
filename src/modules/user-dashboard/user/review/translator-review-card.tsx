"use client"

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TranslatorReviewType } from "@/db/schema";
import { MessageSquare, Star, User } from "lucide-react";
import { RatingRow } from "./rating-row";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface TranslatorReviewCardProps {
    projectId: string
}

export const TranslatorReviewCard = ({ projectId } : TranslatorReviewCardProps) => {
    const trpc = useTRPC()

    const { data: translatorReview, isPending } = useQuery(trpc.reviews.getTranslatorReviewByProjectId.queryOptions({
        id: projectId
    }))

    if (isPending) {
        return <p>Pending</p>
    }

    const review = translatorReview?.translatorReview;

    if (!review) {
        return <p>Review not found</p>
    }
    
    return (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 space-y-3">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">Hodnocení překladatele</span>
            </div>
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
            </div>

            <div className="space-y-1.5">
            <RatingRow label="Kvalita" rating={review.qualityRating} />
            <RatingRow label="Komunikace" rating={review.communicationRating} />
            <RatingRow label="Dochvilnost" rating={review.punctualityRating} />
            </div>

            {review?.comment && (
            <div className="pt-2 border-t border-border/50">
                <div className="flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground italic line-clamp-2">"{review?.comment}"</p>
                </div>
            </div>
            )}
        </div>
    )
}