import { cn } from "@/lib/utils"

interface RslIndicatorProps {
  rsl: number
  className?: string
  showLabel?: boolean
}

function getRslColor(rsl: number) {
  if (rsl > 15) return { bar: "bg-success", text: "text-success", bg: "bg-success/10" }
  if (rsl >= 8) return { bar: "bg-warning", text: "text-warning", bg: "bg-warning/10" }
  return { bar: "bg-danger", text: "text-danger", bg: "bg-danger/10" }
}

export function RslIndicator({ rsl, className, showLabel = true }: RslIndicatorProps) {
  const color = getRslColor(rsl)
  const pct = Math.min(100, (rsl / 25) * 100)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color.bar)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium tabular-nums", color.text)}>
          {rsl.toFixed(1)}N
        </span>
      )}
    </div>
  )
}

export function RslBadge({ rsl }: { rsl: number }) {
  const color = getRslColor(rsl)
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", color.bg, color.text)}>
      RSL {rsl.toFixed(1)} ngày
    </span>
  )
}
