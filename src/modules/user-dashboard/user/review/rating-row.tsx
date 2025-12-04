import { StarRating } from "./star-rating";

export const RatingRow = ({ label, rating }: { label: string; rating: number | null }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    {rating !== null ? (
      <StarRating rating={rating} onRatingChange={() => {}} disabled />
    ) : (
      <span className="text-muted-foreground text-xs">—</span>
    )}
  </div>
)