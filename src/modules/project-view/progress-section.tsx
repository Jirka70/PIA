"use client"
export function ProgressSection({
  progressPercent,
  progressNote,
}: {
  progressPercent: number
  progressNote?: string | null
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Translation Progress</h4>
        <span className="text-2xl font-bold">{progressPercent}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all duration-500 rounded-full ${
            progressPercent === 100
              ? "bg-green-500"
              : progressPercent >= 75
              ? "bg-blue-500"
              : progressPercent >= 50
              ? "bg-yellow-500"
              : "bg-orange-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {progressNote && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Progress Note</p>
          <p className="text-sm">{progressNote}</p>
        </div>
      )}
    </div>
  )
}