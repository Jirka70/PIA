import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Star, ThumbsUp } from "lucide-react";
import { RatingRow } from "./rating-row";
import { CompanyReviewType } from "@/db/schema";

interface CompanyReviewCardProps {
    companyReview: CompanyReviewType
}

export const CompanyReviewCard = ({ companyReview }: CompanyReviewCardProps) => {
    return (
    <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-4 space-y-3">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Building2 className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-semibold text-sm">Hodnocení firmy</span>
        </div>
        {companyReview.overallRating && (
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                <Badge variant="secondary" className="gap-1 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {companyReview.overallRating}/5
                </Badge>
                </TooltipTrigger>
                <TooltipContent>Celkové hodnocení</TooltipContent>
            </Tooltip>
            </TooltipProvider>
        )}
        </div>

        <div className="space-y-1.5">
        <RatingRow label="Cena" rating={companyReview.priceRating} />
        <RatingRow label="Podpora" rating={companyReview.supportRating} />
        </div>

        {companyReview.wouldRecommend !== null && (
        <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
            <ThumbsUp className={`w-3.5 h-3.5 ${companyReview.wouldRecommend ? "text-emerald-500" : "text-muted-foreground"}`} />
            <span
                className={`text-xs font-medium ${companyReview.wouldRecommend ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
            >
                {companyReview.wouldRecommend ? "Doporučuje" : "Nedoporučuje"}
            </span>
            </div>
        </div>
        )}
    </div>
    )
}