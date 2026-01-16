interface ActivityShimmerProps {
    length: number
}

function ActivityShimmer({ length } : ActivityShimmerProps) {
  return (
    <div className="space-y-4">
      {[...Array(length)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/50 rounded w-3/4" />
            <div className="h-3 bg-muted/30 rounded w-1/2" />
            <div className="h-3 bg-muted/30 rounded w-1/3" />
          </div>
          <div className="h-6 w-16 bg-muted/50 rounded-full" />
        </div>
      ))}
    </div>
  )
}
