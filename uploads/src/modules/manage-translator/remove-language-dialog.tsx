import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlertTriangle, Languages } from "lucide-react";

type RemoveLanguageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languageName: string;
  translatorName: string;
  activeProjectsCount: number;
  onConfirm: () => void;
};

export function RemoveLanguageDialog({
  open,
  onOpenChange,
  languageName,
  translatorName,
  activeProjectsCount,
  onConfirm,
}: RemoveLanguageDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg border-destructive/40 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Remove language from translator?
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-3">
            <p className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-semibold">{translatorName}</span> currently
                has{" "}
                <span className="font-semibold">{activeProjectsCount}</span>{" "}
                active project{activeProjectsCount !== 1 && "s"} in{" "}
                <span className="font-semibold">{languageName}</span>.
              </span>
            </p>

            <p>
              Removing this language will prevent them from accessing or
              updating these translations. This may block the project's
              progress or leave it incomplete.
            </p>

            <p className="text-sm text-muted-foreground">
              Before removing this language, ensure the affected projects are
              reassigned or completed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Keep language</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Remove anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
