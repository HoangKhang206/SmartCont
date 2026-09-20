"use client"

import { Truck, Gauge, Star, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getContainers, getRatingsByCarrierId, getBookings } from "@/lib/data-store"
import { formatNumber } from "@/lib/utils"
import type { User } from "@/lib/types"

interface CarrierMetricsProps {
  user: User
}

export function CarrierMetrics({ user }: CarrierMetricsProps) {
  const containers = getContainers().filter((c) => c.carrierId === user.id)
  const ratings = getRatingsByCarrierId(user.id)
  const bookings = getBookings().filter((b) =>
    containers.some((c) => c.id === b.containerId)
  )

  const avgUtil = containers.length > 0
    ? containers.reduce((s, c) => s + c.utilizationPercent, 0) / containers.length
    : 0

  const avgRating = ratings.length > 0
    ? ratings.reduce((s, r) => s + r.overallScore, 0) / ratings.length
    : 0

  const monthlyRevenue = bookings
    .filter((b) => b.status === "completed" || b.status === "in_progress")
    .reduce((s, b) => s + b.totalPriceVnd, 0)

  const metrics = [
    {
      icon: Truck,
      label: "Số lượng cont",
      value: formatNumber(containers.length),
      sub: `${containers.filter((c) => c.currentPhase === "in_transit").length} đang vận chuyển`,
      color: "text-primary",
    },
    {
      icon: Gauge,
      label: "Utilization TB",
      value: `${avgUtil.toFixed(1)}%`,
      sub: "trung bình toàn đội xe",
      color: "text-accent",
    },
    {
      icon: Star,
      label: "Rating trung bình",
      value: ratings.length > 0 ? avgRating.toFixed(1) : "—",
      sub: `${ratings.length} đánh giá nhận được`,
      color: "text-warning",
    },
    {
      icon: TrendingUp,
      label: "Doanh thu tháng",
      value: monthlyRevenue > 0 ? `${formatNumber(Math.round(monthlyRevenue / 1_000_000))}M ₫` : "—",
      sub: "từ booking hoàn thành",
      color: "text-success",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon
        return (
          <Card key={m.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <Icon className={`h-4 w-4 ${m.color}`} />
            </div>
            <p className="text-2xl font-semibold tabular-nums">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
          </Card>
        )
      })}
    </div>
  )
}
