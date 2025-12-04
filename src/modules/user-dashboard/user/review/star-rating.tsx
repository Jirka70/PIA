"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  maxRating?: number
  disabled?: boolean
}

export function StarRating({ rating, onRatingChange, maxRating = 5, disabled = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRatingChange(star)}
          className={cn(
            "transition-colors hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          )}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground hover:text-amber-300",
            )}
          />
        </button>
      ))}
    </div>
  )
}
