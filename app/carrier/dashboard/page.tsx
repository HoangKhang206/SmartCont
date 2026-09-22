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
import { DisruptionSimulatorPanel } from "@/components/dashboard/DisruptionSimulatorPanel"
import { getCurrentUser, getContainers, getRatingsByCarrierId, getBookings } from "@/lib/data-store"
import { formatDateTime, formatNumber } from "@/lib/utils"
import type { User, Container } from "@/lib/types"

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
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
        </div>
        {trend && (
          <Badge
            variant="outline"
            className={`text-[9px] h-4 px-1.5 font-medium ${
              trendUp
                ? "border-success/30 text-success bg-success/8"
                : "border-warning/30 text-warning bg-warning/8"
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

// Reputation & Reliability panel
function ReputationPanel({ userId }: { userId: string }) {
  const ratings = getRatingsByCarrierId(userId)
  const containers = getContainers().filter((c) => c.carrierId === userId)

  const coldChain = ratings.length > 0
    ? (ratings.reduce((s, r) => s + (r.criteria?.coldChain ?? r.overallScore), 0) / ratings.length * 20).toFixed(0)
    : "—"
  const onTime = ratings.length > 0
    ? (ratings.reduce((s, r) => s + (r.criteria?.punctuality ?? r.overallScore), 0) / ratings.length * 20).toFixed(0)
    : "—"
  const overall = ratings.length > 0
    ? (ratings.reduce((s, r) => s + r.overallScore, 0) / ratings.length).toFixed(1)
    : "—"

  const fakeMetrics = [
    { label: "Cold Chain",   value: coldChain !== "—" ? `${coldChain}%` : "96%",  level: "High",   color: "text-success" },
    { label: "Đúng giờ",    value: onTime !== "—" ? `${onTime}%` : "89%",         level: "Medium", color: "text-warning" },
    { label: "Overall",      value: overall !== "—" ? `${overall}★` : "4.7★",     level: "High",   color: "text-success" },
  ]

  const tempViolations = containers.filter(
    (c) => c.currentPhase === "in_transit" || c.currentPhase === "at_warehouse"
  ).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <BarChart2 className="h-4 w-4 text-accent" />
        <p className="font-medium text-sm">Reputation & Reliability</p>
      </div>

      <div className="space-y-2">
        {fakeMetrics.map(({ label, value, level, color }) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold tabular-nums ${color}`}>{value}</span>
              <Badge
                variant="outline"
                className={`text-[9px] h-4 px-1.5 ${
                  level === "High"
                    ? "border-success/30 text-success bg-success/8"
                    : level === "Medium"
                    ? "border-warning/30 text-warning bg-warning/8"
                    : "border-danger/30 text-danger bg-danger/8"
                }`}
              >
                {level}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {tempViolations > 0 && (
        <div className="p-3 rounded-md bg-warning/8 border border-warning/20 text-xs text-warning leading-relaxed">
          <p className="font-medium mb-0.5">Cold-chain compliance</p>
          <p className="text-muted-foreground text-[10px]">
            {tempViolations} cont đang trong tình trạng cần kiểm tra nhiệt độ định kỳ.
          </p>
        </div>
      )}

      <div className="pt-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>Buyer Reliability score</span>
          <span className="font-medium text-foreground">Tổng {ratings.length} đánh giá</span>
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
    <DashboardShell requiredRole="carrier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Xin chào, {user.name} 👋</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tổng quan hoạt động vận chuyển của đội xe</p>
          </div>
          <Button asChild>
            <Link href="/carrier/containers/new" className="gap-2">
              <Plus className="h-4 w-4" />Publish chuyến
            </Link>
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Truck}
            label="Số container"
            value={String(getContainers().filter((c) => c.carrierId === user.id).length)}
            sub={`${containers.filter((c) => c.currentPhase === "in_transit").length} đang vận chuyển`}
            trend="+1 cont mới"
            trendUp
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <MetricCard
            icon={Gauge}
            label="Utilization TB"
            value={`${avgUtil.toFixed(1)}%`}
            sub="trung bình toàn đội xe"
            trend="+3.2% vs tuần trước"
            trendUp
            iconColor="text-accent"
            iconBg="bg-accent/10"
          />
          <MetricCard
            icon={Star}
            label="Rating trung bình"
            value={avgRating > 0 ? `${avgRating.toFixed(1)}★` : "4.7★"}
            sub={`${getRatingsByCarrierId(user.id).length} đánh giá nhận được`}
            trend="+0.2 vs tháng trước"
            trendUp
            iconColor="text-warning"
            iconBg="bg-warning/10"
          />
          <MetricCard
            icon={TrendingUp}
            label="Doanh thu tháng"
            value={monthlyRevenue > 0 ? `${formatNumber(Math.round(monthlyRevenue / 1_000_000))}M ₫` : "47.3M ₫"}
            sub="từ booking hoàn thành"
            trend="+12% vs tháng trước"
            trendUp
            iconColor="text-success"
            iconBg="bg-success/10"
          />
        </div>

        {/* Map + Bookings */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Container Network Map */}
          <Card className="lg:col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-accent" />
                <p className="font-medium text-sm">Fleet Network</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-success font-medium">Live</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ContainerNetworkMap />
            </div>
          </Card>

          {/* Incoming Bookings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-sm">Booking mới</p>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/carrier/bookings">Tất cả</Link>
              </Button>
            </div>
            <IncomingBookings user={user} />
          </Card>
        </div>

        {/* Bottom row: Rating + Fleet + Disruption */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Rating Breakdown */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-sm">Đánh giá</p>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/carrier/ratings">Chi tiết</Link>
              </Button>
            </div>
            <RatingBreakdown user={user} />
          </Card>

          {/* Container fleet list */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-sm">Container của bạn</p>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/carrier/containers">Xem tất cả</Link>
              </Button>
            </div>
            {containers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Chưa có cont.{" "}
                <Link href="/carrier/containers/new" className="text-accent underline">Publish ngay</Link>
              </p>
            ) : (
              <div className="divide-y divide-border/40">
                {containers.map((c) => (
                  <Link
                    key={c.id}
                    href={`/carrier/containers/${encodeURIComponent(c.id)}`}
                    className="py-2.5 flex items-center justify-between gap-2 hover:bg-muted/20 -mx-1 px-1 rounded transition-colors"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium">{c.id}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDateTime(c.departureDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground tabular-nums">{c.utilizationPercent.toFixed(1)}%</span>
                      <StatusBadge status={c.currentPhase} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Reputation + Disruption Sim */}
          <div className="space-y-4">
            <Card className="p-4">
              <ReputationPanel userId={user.id} />
            </Card>
            <Card className="p-4">
              <DisruptionSimulatorPanel />
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
