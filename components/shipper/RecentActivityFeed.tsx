"use client"

import { Package, CheckCircle2, GitMerge, AlertTriangle, Star } from "lucide-react"
import { cn, formatRelative } from "@/lib/utils"
import { getBookings, getShipments } from "@/lib/data-store"
import type { User } from "@/lib/types"

const typeConfig = {
  new_shipment: { icon: Package, color: "text-accent", bg: "bg-accent/10", label: "Tạo lô hàng mới" },
  booking_confirmed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Booking xác nhận" },
  consolidation: { icon: GitMerge, color: "text-cold", bg: "bg-cold-soft", label: "Ghép cont" },
  incident: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Sự cố" },
  rating: { icon: Star, color: "text-warning", bg: "bg-warning/10", label: "Đánh giá" },
}

interface ActivityItem {
  id: string
  type: keyof typeof typeConfig
  title: string
  time: string
}

interface RecentActivityFeedProps {
  user: User
}

export function RecentActivityFeed({ user }: RecentActivityFeedProps) {
  const shipments = getShipments().filter((s) => s.shipperId === user.id)
  const bookings = getBookings().filter((b) => b.shipperId === user.id)

  const activities: ActivityItem[] = [
    ...shipments.slice(0, 3).map((s) => ({
      id: `s_${s.id}`,
      type: "new_shipment" as const,
      title: `Tạo lô hàng mới ${s.weightKg / 1000}T — ${s.destinationBorder}`,
      time: s.createdAt,
    })),
    ...bookings.slice(0, 3).map((b) => ({
      id: `b_${b.id}`,
      type: b.type === "consolidation" ? ("consolidation" as const) : ("booking_confirmed" as const),
      title: b.type === "consolidation" ? `Ghép cont thành công — ${b.containerId}` : `Booking xác nhận — ${b.containerId}`,
      time: b.bookedAt,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6)

  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">Chưa có hoạt động nào.</p>
  }

  return (
    <div className="space-y-3">
      {activities.map((item) => {
        const config = typeConfig[item.type]
        const Icon = config.icon
        return (
          <div key={item.id} className="flex items-start gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0", config.bg)}>
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{formatRelative(item.time)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
