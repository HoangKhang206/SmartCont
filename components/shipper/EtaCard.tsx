import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatEtaWithMargin, formatDateTime } from "@/lib/utils"
import type { ETAPrediction } from "@/lib/types"

interface EtaCardProps {
  eta: ETAPrediction
  className?: string
}

function FactorImpact({ minutes }: { minutes: number }) {
  if (minutes > 0) return <TrendingUp className="h-3.5 w-3.5 text-danger flex-shrink-0" />
  if (minutes < 0) return <TrendingDown className="h-3.5 w-3.5 text-success flex-shrink-0" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
}

export function EtaCard({ eta, className }: EtaCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-accent" />
        <p className="text-sm font-medium">AI ETA Prediction</p>
        <span className="ml-auto text-xs text-muted-foreground">cập nhật liên tục</span>
      </div>

      <p className="text-3xl font-semibold tabular-nums mb-1">
        {formatEtaWithMargin(eta.hoursRemaining, eta.marginMinutes)}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">
            Độ tin cậy: <span className="font-medium text-foreground">{eta.confidencePercent}%</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Dự kiến đến: {formatDateTime(eta.arrivalTimeIso)}
        </span>
      </div>

      {eta.factors.length > 0 && (
        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">Yếu tố ảnh hưởng</p>
          {eta.factors.map((factor, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <FactorImpact minutes={factor.impactMinutes} />
              <span className="flex-1 text-muted-foreground">{factor.label}</span>
              {factor.impactMinutes !== 0 && (
                <span className={cn(
                  "font-medium tabular-nums",
                  factor.impactMinutes > 0 ? "text-danger" : "text-success"
                )}>
                  {factor.impactMinutes > 0 ? "+" : ""}{factor.impactMinutes}p
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
