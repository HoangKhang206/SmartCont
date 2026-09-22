"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Truck, Star, TrendingUp, Gauge, BarChart2, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { IncomingBookings } from "@/components/carrier/IncomingBookings"
import { RatingBreakdown } from "@/components/carrier/RatingBreakdown"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ContainerNetworkMap } from "@/components/dashboard/ContainerNetworkMap"
import { getCurrentUser, getContainers, getRatingsByCarrierId, getBookings } from "@/lib/data-store"
import { formatDateTime, formatNumber } from "@/lib/utils"
import type { User, Container } from "@/lib/types"

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
    <Card className="px-4 py-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0 ${iconBg}`}>
          <Icon className={`h-[18px] w-[18px] ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1">
            <p className="text-2xl font-semibold tabular-nums leading-none">{value}</p>
            {trend && (
              <Badge
                variant="outline"
                className={`text-[9px] h-4 px-1.5 font-medium flex-shrink-0 ${
                  trendUp
                    ? "border-success/30 text-success bg-success/8"
                    : "border-warning/30 text-warning bg-warning/8"
                }`}
              >
                {trend}
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{label}</p>
        </div>
      </div>
    </Card>
  )
}

function ReputationPanel({ userId }: { userId: string }) {
  const ratings = getRatingsByCarrierId(userId)

  const coldChain = ratings.length > 0
    ? (ratings.reduce((s, r) => s + (r.criteria?.coldChain ?? r.overallScore), 0) / ratings.length * 20).toFixed(0)
    : "96"
  const onTime = ratings.length > 0
    ? (ratings.reduce((s, r) => s + (r.criteria?.punctuality ?? r.overallScore), 0) / ratings.length * 20).toFixed(0)
    : "89"
  const overall = ratings.length > 0
    ? (ratings.reduce((s, r) => s + r.overallScore, 0) / ratings.length).toFixed(1)
    : "4.7"

  const metrics = [
    { label: "Cold Chain",  value: `${coldChain}%`,  color: "text-success",  badge: "High" },
    { label: "On-time",     value: `${onTime}%`,     color: "text-warning",  badge: "Medium" },
    { label: "Overall",     value: `${overall}★`,    color: "text-success",  badge: "High" },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className="h-4 w-4 text-accent" />
        <p className="font-medium text-sm">Reputation & Reliability</p>
      </div>
      <div className="space-y-1.5">
        {metrics.map(({ label, value, color, badge }) => (
          <div key={label} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold tabular-nums ${color}`}>{value}</span>
              <Badge
                variant="outline"
                className={`text-[9px] h-4 px-1.5 ${
                  badge === "High"
                    ? "border-success/30 text-success bg-success/8"
                    : "border-warning/30 text-warning bg-warning/8"
                }`}
              >
                {badge}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
          <span>Buyer Reliability score</span>
          <span className="font-medium text-foreground">{ratings.length} đánh giá</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: ratings.length > 0 ? `${Math.min(100, (parseFloat(overall) / 5) * 100)}%` : "60%" }}
          />
        </div>
      </div>
    </div>
  )
}

export default function CarrierDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [avgUtil, setAvgUtil] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [mapMode, setMapMode] = useState<"live" | "simulation">("live")

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const conts = getContainers().filter((c) => c.carrierId === u.id)
      setContainers(conts.slice(0, 4))

      const util = conts.length > 0
        ? conts.reduce((s, c) => s + c.utilizationPercent, 0) / conts.length
        : 0
      setAvgUtil(util)

      const ratings = getRatingsByCarrierId(u.id)
      const rating = ratings.length > 0
        ? ratings.reduce((s, r) => s + r.overallScore, 0) / ratings.length
        : 0
      setAvgRating(rating)

      const bookings = getBookings().filter((b) =>
        conts.some((c) => c.id === b.containerId)
      )
      const rev = bookings
        .filter((b) => b.status === "completed" || b.status === "in_progress")
        .reduce((s, b) => s + b.totalPriceVnd, 0)
      setMonthlyRevenue(rev)
    }
  }, [])

  if (!user) return null

  return (
    <DashboardShell requiredRole="carrier" noScroll>
      {/* 1-viewport-fit: flex column fills exactly h-full, no scroll */}
      <div className="h-full overflow-hidden flex flex-col gap-3">

        {/* Row 1 — Header */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Xin chào, {user.name} 👋</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Tổng quan hoạt động vận chuyển của đội xe</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/carrier/containers/new" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />Publish chuyến
            </Link>
          </Button>
        </div>

        {/* Row 2 — 4 metric cards */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-3">
          <MetricCard
            icon={Truck}
            label="Số container"
            value={String(getContainers().filter((c) => c.carrierId === user.id).length)}
            trend="+1 cont mới"
            trendUp
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <MetricCard
            icon={Gauge}
            label="Utilization TB"
            value={`${avgUtil.toFixed(1)}%`}
            trend="+3.2% vs tuần trước"
            trendUp
            iconColor="text-accent"
            iconBg="bg-accent/10"
          />
          <MetricCard
            icon={Star}
            label="Rating trung bình"
            value={avgRating > 0 ? `${avgRating.toFixed(1)}★` : "4.7★"}
            trend="+0.2 vs tháng trước"
            trendUp
            iconColor="text-warning"
            iconBg="bg-warning/10"
          />
          <MetricCard
            icon={TrendingUp}
            label="Doanh thu tháng"
            value={monthlyRevenue > 0 ? `${formatNumber(Math.round(monthlyRevenue / 1_000_000))}M ₫` : "47.3M ₫"}
            trend="+12% vs tháng trước"
            trendUp
            iconColor="text-success"
            iconBg="bg-success/10"
          />
        </div>

        {/* Row 3 — Fleet Map (2/3) + Incoming Bookings (1/3) */}
        <div className="flex-1 min-h-0 grid grid-cols-3 gap-3">
          <Card className="col-span-2 p-3 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-accent" />
                <p className="font-medium text-sm">Fleet Network</p>
              </div>
              <div className="flex rounded-full border border-border overflow-hidden">
                {(["live", "simulation"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMapMode(m)}
                    className={`px-3 py-0.5 text-[11px] font-medium transition-colors ${
                      mapMode === m
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {m === "live" ? "Live" : "Simulation"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ContainerNetworkMap mode={mapMode} />
            </div>
          </Card>

          <Card className="p-3 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <p className="font-medium text-sm">Booking mới</p>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                <Link href="/carrier/bookings">Tất cả</Link>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <IncomingBookings user={user} />
            </div>
          </Card>
        </div>

        {/* Row 4 — Bottom 3 cards, expanded */}
        <div className="flex-shrink-0 h-64 grid grid-cols-3 gap-3">

          {/* Rating Breakdown */}
          <Card className="p-3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <p className="font-medium text-sm">Đánh giá</p>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                <Link href="/carrier/ratings">Chi tiết</Link>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <RatingBreakdown user={user} />
            </div>
          </Card>

          {/* Container fleet list */}
          <Card className="p-3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <p className="font-medium text-sm">Container của bạn</p>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                <Link href="/carrier/containers">Xem tất cả</Link>
              </Button>
            </div>
            {containers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Chưa có cont.{" "}
                <Link href="/carrier/containers/new" className="text-accent underline">Publish ngay</Link>
              </p>
            ) : (
              <div className="divide-y divide-border/40 overflow-y-auto flex-1 min-h-0">
                {containers.slice(0, 3).map((c) => (
                  <Link
                    key={c.id}
                    href={`/carrier/containers/${encodeURIComponent(c.id)}`}
                    className="py-2 flex items-center justify-between gap-2 hover:bg-muted/20 -mx-1 px-1 rounded transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-medium truncate">{c.id}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDateTime(c.departureDate)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">{c.utilizationPercent.toFixed(1)}%</span>
                      <StatusBadge status={c.currentPhase} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Reputation & Reliability */}
          <Card className="p-3 overflow-hidden">
            <ReputationPanel userId={user.id} />
          </Card>

        </div>
      </div>
    </DashboardShell>
  )
}
