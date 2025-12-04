import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

interface DisabledTooltipWrapperProps {
  disabled: boolean
  disabledReason?: string
  children: React.ReactNode
}

// Wrap libovolný element tooltipem, když je disabled
export function ProjectClosedTooltip({
  disabled,
  disabledReason = "The project has already been closed.",
  children,
}: DisabledTooltipWrapperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* wrapper, protože disabled element nebude přijímat mouse events */}
        <div className="w-fit cursor-not-allowed">
          {children}
        </div>
      </TooltipTrigger>

      {disabled && (
        <TooltipContent>
          <p>{disabledReason}</p>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
