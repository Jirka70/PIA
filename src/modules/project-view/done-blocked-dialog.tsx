"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, BadgeCheck, Hourglass, ThumbsDown } from "lucide-react"
import { useMemo } from "react"

type AcceptState = "n/a" | "waiting for approval" | "accepted" | "rejected"

interface DoneBlockedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  /** Current acceptState */
  acceptState: AcceptState

  /** Admin proceeds anyway (force DONE) */
  onForceDone: () => Promise<void> | void

  /** Optional: navigate admin to QA / project detail / communications */
  onGoBack?: () => void

  /** Loading state while forcing */
  isForcing?: boolean
}

export const DoneBlockedDialog = ({
  open,
  onOpenChange,
  acceptState,
  onForceDone,
  onGoBack,
  isForcing = false
}: DoneBlockedDialogProps) => {
  const ui = useMemo(() => {
    switch (acceptState) {
      case "waiting for approval":
        return {
          icon: Hourglass,
          title: "Projekt nelze uzavřít – čeká na schválení zákazníkem",
          badgeVariant: "secondary" as const,
          description:
            "Zákazník zatím nerozhodl. Doporučení: ponechte projekt ve stavu QA, případně zákazníkovi připomeňte, že čekáme na jeho approval."
        }
      case "rejected":
        return {
          icon: ThumbsDown,
          title: "Projekt nelze uzavřít – zákazník výstup zamítl",
          badgeVariant: "destructive" as const,
          description:
            "Zákazník projekt zamítl. Doporučení: ověřte požadavky na úpravy a vraťte projekt do IN_PROGRESS / QA dle procesu."
        }
      case "n/a":
      default:
        return {
          icon: AlertTriangle,
          title: "Projekt nelze uzavřít – approval není dostupný",
          badgeVariant: "outline" as const,
          description:
            "Projekt je stále v procesu. Doporučení: uzavření povolit až po přechodu do QA a stavu waiting for approval / accepted."
        }
    }
  }, [acceptState])

  const Icon = ui.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Uzavření projektu vyžaduje zákaznický approval
          </DialogTitle>
        </DialogHeader>

        <Alert className="border-red-500/30 bg-red-500/5">
          <AlertTitle className="flex items-center justify-between gap-3">
            <span className="font-semibold">{ui.title}</span>
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm text-muted-foreground">{ui.description}</AlertDescription>
        </Alert>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="font-medium">Co můžete udělat:</div>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Nechte projekt ve stavu QA, dokud zákazník nepotvrdí.</li>
            <li>Pokud zákazník zamítl, vraťte projekt k úpravám a vyžádejte doplnění zadání.</li>
            <li>Pokud musíte uzavřít výjimečně, můžete projekt uzavřít „force“ (auditujte interně).</li>
          </ul>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onGoBack?.()
              onOpenChange(false)
            }}
          >
            Zpět
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                await onForceDone()
                onOpenChange(false)
              }}
              disabled={isForcing}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {isForcing ? "Uzavírám…" : "Force"}
            </Button>

            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <BadgeCheck className="h-4 w-4" />
              Rozumím
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
