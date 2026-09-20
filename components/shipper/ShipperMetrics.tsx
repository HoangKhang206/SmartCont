"use client"

import { Package, Truck, Leaf, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getShipments, getBookings } from "@/lib/data-store"
import { formatNumber } from "@/lib/utils"
import type { User } from "@/lib/types"

interface ShipperMetricsProps {
  user: User
}

export function ShipperMetrics({ user }: ShipperMetricsProps) {
  const shipments = getShipments().filter((s) => s.shipperId === user.id)
  const bookings = getBookings().filter((b) => b.shipperId === user.id)

  const inTransit = shipments.filter((s) => s.status === "in_transit").length
  const avgRsl = shipments.length > 0
    ? shipments.reduce((sum, s) => sum + s.rsl, 0) / shipments.length
    : 0
  const completedBookings = bookings.filter((b) => b.status === "completed")
  const costSavedVnd = completedBookings
    .filter((b) => b.type === "consolidation")
    .reduce((sum, b) => sum + b.totalPriceVnd * 0.12, 0)

  const metrics = [
    {
      icon: Package,
      label: "Tổng lô hàng",
      value: formatNumber(shipments.length),
      sub: `${completedBookings.length} đã hoàn thành`,
      color: "text-primary",
    },
    {
      icon: Truck,
      label: "Đang vận chuyển",
      value: formatNumber(inTransit),
      sub: "lô đang trên đường",
      color: "text-accent",
    },
    {
      icon: Leaf,
      label: "RSL trung bình",
      value: `${avgRsl.toFixed(1)} ngày`,
      sub: "thời gian tươi còn lại",
      color: "text-success",
    },
    {
      icon: TrendingUp,
      label: "Tiết kiệm từ ghép cont",
      value: costSavedVnd > 0 ? `${formatNumber(Math.round(costSavedVnd / 1000))}K ₫` : "—",
      sub: "ước tính so với FCL",
      color: "text-warning",
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
