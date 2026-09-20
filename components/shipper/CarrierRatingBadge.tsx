import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { getRatings } from "@/lib/data-store"

interface CarrierRatingBadgeProps {
  carrierId: string
  className?: string
}

export function CarrierRatingBadge({ carrierId, className }: CarrierRatingBadgeProps) {
  const ratings = getRatings().filter((r) => r.carrierId === carrierId)
  if (ratings.length === 0) return <span className="text-xs text-muted-foreground">Chưa có đánh giá</span>

  const avg = ratings.reduce((sum, r) => sum + r.overallScore, 0) / ratings.length

  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      <span className="font-medium tabular-nums">{avg.toFixed(1)}</span>
      <span className="text-muted-foreground text-xs">({ratings.length})</span>
    </span>
  )
}
