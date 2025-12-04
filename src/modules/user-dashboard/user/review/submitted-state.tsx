// components/reviews/SubmittedState.tsx
import { CheckCircle2 } from "lucide-react"

export function SubmittedState({ type }: { type: "translator" | "company" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="rounded-full bg-green-100 p-3">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {type === "translator" ? "Překladatel ohodnocen" : "Firma ohodnocena"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Děkujeme za vaši recenzi! Vaše hodnocení pomáhá ostatním uživatelům.
        </p>
      </div>
    </div>
  )
}
