import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PHASE_LABELS } from "@/lib/constants"
import { PHASE_ORDER, type ContainerPhase } from "@/lib/types"

interface PhaseTrackerProps {
  currentPhase: ContainerPhase
  className?: string
}

export function PhaseTracker({ currentPhase, className }: PhaseTrackerProps) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase)

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex items-start gap-0 min-w-max">
        {PHASE_ORDER.map((phase, idx) => {
          const isDone = idx < currentIdx
          const isActive = idx === currentIdx
          const isUpcoming = idx > currentIdx

          return (
            <div key={phase} className="flex items-start">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                    isDone && "border-success bg-success",
                    isActive && "border-accent bg-accent",
                    isUpcoming && "border-border bg-background"
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className={cn("h-3.5 w-3.5", isActive ? "text-accent-foreground fill-accent-foreground" : "text-muted-foreground")} />
                  )}
                </div>
                <p className={cn(
                  "mt-1.5 text-[10px] text-center max-w-[72px] leading-tight",
                  isActive && "font-medium text-accent",
                  isDone && "text-success",
                  isUpcoming && "text-muted-foreground"
                )}>
                  {PHASE_LABELS[phase]}
                </p>
              </div>

              {/* Connector */}
              {idx < PHASE_ORDER.length - 1 && (
                <div className={cn("h-0.5 w-8 mt-3.5 mx-1", idx < currentIdx ? "bg-success" : "bg-border")} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
