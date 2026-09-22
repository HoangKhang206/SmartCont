"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, GitMerge, Map, Star, TrendingUp, Package, Container, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { UpcomingShipmentsTable } from "@/components/shipper/UpcomingShipmentsTable"
import { RecentActivityFeed } from "@/components/shipper/RecentActivityFeed"
import { RslDonutChart } from "@/components/dashboard/RslDonutChart"
import { ContainerNetworkMap } from "@/components/dashboard/ContainerNetworkMap"
import { DisruptionSimulatorPanel } from "@/components/dashboard/DisruptionSimulatorPanel"
import { LiveTrackingMini } from "@/components/dashboard/LiveTrackingMini"
import { getCurrentUser, getBookings, getRatings, getShipments, getContainers } from "@/lib/data-store"
import { formatNumber } from "@/lib/utils"
import type { User, Booking } from "@/lib/types"

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string
  sub: string
  trend?: string
  trendUp?: boolean
  iconColor?: string
  iconBg?: string
}

function MetricCard({ icon: Icon, label, value, sub, trend, trendUp, iconColor = "text-accent", iconBg = "bg-accent/10" }: MetricCardProps) {
  return (
    <Card className="p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
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
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {user ? `Xin chào, ${user.name.split(" ").pop()} 👋` : "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Theo dõi real-time & tối ưu cold chain cho chuỗi xuất khẩu của bạn
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/shipper/consolidation">
                <GitMerge className="h-4 w-4 mr-1.5" />Ghép cont
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/shipper/shipments/new">
                <Plus className="h-4 w-4 mr-1.5" />Tạo LOT
              </Link>
            </Button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Package}
            label="Total LOTs"
            value={String(metrics.totalLots)}
            sub="lô hàng trong hệ thống"
            trend="+2 vs hôm qua"
            trendUp
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <MetricCard
            icon={Container}
            label="Available Reefer Containers"
            value={String(metrics.availableContainers)}
            sub="sẵn sàng booking ngay"
            trend="+3 vs hôm qua"
            trendUp
            iconColor="text-cold"
            iconBg="bg-cold/10"
          />
          <MetricCard
            icon={AlertTriangle}
            label="At Risk LOTs"
            value={String(metrics.atRisk)}
            sub="RSL < 24h — cần ưu tiên"
            trend={metrics.atRisk > 0 ? "-1 vs hôm qua" : "Ổn định"}
            trendUp
            iconColor="text-danger"
            iconBg="bg-danger/10"
          />
          <MetricCard
            icon={TrendingUp}
            label="On-time Rate"
            value={metrics.onTimeRate}
            sub="7 ngày gần nhất"
            trend="+2% vs tuần trước"
            trendUp
            iconColor="text-success"
            iconBg="bg-success/10"
          />
        </div>

        {/* Map + Disruption Simulator */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Container Network Map */}
          <Card className="lg:col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-accent" />
                <p className="font-medium text-sm">Container Network</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-success font-medium">Live</span>
              </div>
            </div>
            <div className="h-[320px]">
              <ContainerNetworkMap />
            </div>
          </Card>

          {/* Disruption Simulator */}
          <Card className="p-4">
            <DisruptionSimulatorPanel />
          </Card>
        </div>

        {/* Bottom row: RSL + Active LOTs + Live Tracking */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* RSL Overview */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-sm">RSL Overview</p>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/shipper/shipments">Xem tất cả</Link>
              </Button>
            </div>
            {user && <RslDonutChart user={user} />}
          </Card>

          {/* Active LOTs table */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-sm">LOT đang hoạt động</p>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/shipper/shipments">Tất cả</Link>
              </Button>
            </div>
            {user && <UpcomingShipmentsTable user={user} />}
          </Card>

          {/* Live Tracking + Activity */}
          <div className="space-y-4">
            {/* Pending ratings */}
            {pendingRatings.length > 0 && (
              <Card className="p-4 border-warning/30 bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <p className="font-medium text-sm">{pendingRatings.length} chuyến chờ đánh giá</p>
                </div>
                <Button size="sm" variant="outline" className="w-full border-warning/40 text-warning hover:bg-warning/10 text-xs" asChild>
                  <Link href={`/shipper/ratings/new/${pendingRatings[0].id}`}>Đánh giá ngay</Link>
                </Button>
              </Card>
            )}

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-sm">Live Tracking</p>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link href="/shipper/tracking">Bản đồ</Link>
                </Button>
              </div>
              {user && <LiveTrackingMini user={user} />}
            </Card>

            <Card className="p-4">
              <p className="font-medium text-sm mb-3">Hoạt động gần đây</p>
              {user && <RecentActivityFeed user={user} />}
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
