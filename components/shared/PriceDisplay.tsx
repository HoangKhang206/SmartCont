import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  amountVnd: number
  size?: "sm" | "md" | "lg"
  className?: string
  showUnit?: boolean
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl font-semibold",
}

export function PriceDisplay({ amountVnd, size = "md", className, showUnit = true }: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat("vi-VN").format(amountVnd)

  return (
    <span className={cn("tabular-nums", sizeMap[size], className)}>
      {formatted}
      {showUnit && <span className="ml-0.5 text-muted-foreground">₫</span>}
    </span>
  )
}
