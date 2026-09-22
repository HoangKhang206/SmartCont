"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, GitMerge, Map, Star, TrendingUp, Package, Container, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { UpcomingShipmentsTable } from "@/components/shipper/UpcomingShipmentsTable"
import { RslDonutChart } from "@/components/dashboard/RslDonutChart"
import { ContainerNetworkMap } from "@/components/dashboard/ContainerNetworkMap"
import { DisruptionSimulatorPanel } from "@/components/dashboard/DisruptionSimulatorPanel"
import { LiveTrackingMini } from "@/components/dashboard/LiveTrackingMini"
import { getCurrentUser, getBookings, getRatings, getShipments, getContainers } from "@/lib/data-store"
import type { User, Booking } from "@/lib/types"

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string
  trend?: string
  trendUp?: boolean
  iconColor?: string
  iconBg?: string
}

function MetricCard({ icon: Icon, label, value, trend, trendUp, iconColor = "text-accent", iconBg = "bg-accent/10" }: MetricCardProps) {
  return (
    <Card className="p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {trend && (
          <Badge
            variant="outline"
            className={`text-[9px] h-4 px-1.5 font-medium ${
              trendUp
                ? "border-success/30 text-success bg-success/8"
                : "border-danger/30 text-danger bg-danger/8"
            }`}
          >
            {trend}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-tight">{label}</p>
    </Card>
  )
}

export default function ShipperDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [pendingRatings, setPendingRatings] = useState<Booking[]>([])
  const [metrics, setMetrics] = useState({
    totalLots: 0, availableContainers: 0, atRisk: 0, onTimeRate: "96%",
  })

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const ratedIds = new Set(getRatings().map((r) => r.bookingId))
      const pending = getBookings().filter(
        (b) => b.shipperId === u.id && b.status === "completed" && !ratedIds.has(b.id)
      )
      setPendingRatings(pending)

      const shipments = getShipments().filter((s) => s.shipperId === u.id)
      const atRisk = shipments.filter((s) => s.rsl < 24).length
      const available = getContainers().filter(
        (c) => !["in_transit", "at_border", "cleared_border"].includes(c.currentPhase)
      ).length
      setMetrics({ totalLots: shipments.length, availableContainers: available, atRisk, onTimeRate: "96%" })
    }
  }, [])

  return (
    <DashboardShell requiredRole="shipper">
      {/* 1-viewport-fit: flex column fills exactly h-full, no scroll */}
      <div className="h-full overflow-hidden flex flex-col gap-3">

        {/* Row 1 — Header */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {user ? `Xin chào, ${user.name.split(" ").pop()} 👋` : "Dashboard"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time monitoring &amp; dynamic optimization for your durian export chain
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/shipper/consolidation">
                <GitMerge className="h-3.5 w-3.5 mr-1.5" />Ghép cont
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/shipper/shipments/new">
                <Plus className="h-3.5 w-3.5 mr-1.5" />Tạo LOT
              </Link>
            </Button>
          </div>
        </div>

        {/* Row 2 — 4 metric cards */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-3">
          <MetricCard
            icon={Package}
            label="Total LOTs"
            value={String(metrics.totalLots)}
            trend="+2 vs hôm qua"
            trendUp
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <MetricCard
            icon={Container}
            label="Available Reefer Containers"
            value={String(metrics.availableContainers)}
            trend="+3 vs hôm qua"
            trendUp
            iconColor="text-cold"
            iconBg="bg-cold/10"
          />
          <MetricCard
            icon={AlertTriangle}
            label="At Risk LOTs"
            value={String(metrics.atRisk)}
            trend={metrics.atRisk > 0 ? "-1 vs hôm qua" : "Ổn định"}
            trendUp
            iconColor="text-danger"
            iconBg="bg-danger/10"
          />
          <MetricCard
            icon={TrendingUp}
            label="On-time Delivery Rate"
            value={metrics.onTimeRate}
            trend="+2% vs tuần trước"
            trendUp
            iconColor="text-success"
            iconBg="bg-success/10"
          />
        </div>

        {/* Row 3 — Map (2/3) + Disruption Simulator (1/3), fills remaining height */}
        <div className="flex-1 min-h-0 grid grid-cols-3 gap-3">
          {/* Container Network Map */}
          <Card className="col-span-2 p-3 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-accent" />
                <p className="font-medium text-sm">Container Network</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-success font-medium">Live</span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ContainerNetworkMap />
            </div>
          </Card>

          {/* Disruption Simulator */}
          <Card className="p-3 min-h-0 overflow-hidden flex flex-col">
            <DisruptionSimulatorPanel />
          </Card>
        </div>

        {/* Row 4 — Bottom 3 cards, fixed height */}
        <div className="flex-shrink-0 h-56 grid grid-cols-3 gap-3">

          {/* RSL Overview */}
          <Card className="p-3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <p className="font-medium text-sm">RSL Overview</p>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                <Link href="/shipper/shipments">View all</Link>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {user && <RslDonutChart user={user} compact />}
            </div>
          </Card>

          {/* LOT đang hoạt động */}
          <Card className="p-3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <p className="font-medium text-sm">LOT đang hoạt động</p>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                <Link href="/shipper/shipments">Tất cả</Link>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {user && <UpcomingShipmentsTable user={user} />}
            </div>
          </Card>

          {/* Live Tracking */}
          <div className="overflow-hidden flex flex-col gap-2">
            {pendingRatings.length > 0 && (
              <Card className="p-3 border-warning/30 bg-warning/5 flex-shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                  <p className="font-medium text-xs">{pendingRatings.length} chuyến chờ đánh giá</p>
                </div>
                <Button size="sm" variant="outline" className="w-full h-6 text-[10px] border-warning/40 text-warning hover:bg-warning/10" asChild>
                  <Link href={`/shipper/ratings/new/${pendingRatings[0].id}`}>Đánh giá ngay</Link>
                </Button>
              </Card>
            )}
            <Card className="p-3 overflow-hidden flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <p className="font-medium text-sm">Live Tracking</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                  <Link href="/shipper/tracking">Bản đồ</Link>
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                {user && <LiveTrackingMini user={user} />}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </DashboardShell>
  )
}
