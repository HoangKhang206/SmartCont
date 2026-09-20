"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Package, Truck, Zap, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { getCurrentUser, getContainers, getBookings, getRouteById } from "@/lib/data-store"
import { CONTAINER_SPECS } from "@/lib/constants"
import { formatDateTime, formatNumber } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { User, Container, Booking } from "@/lib/types"

interface ContainerWithBooking extends Container {
  activeBookings: Booking[]
}

function UtilizationBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-success" : value >= 40 ? "bg-accent" : "bg-muted-foreground/30"
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

function ContainerCard({ c }: { c: ContainerWithBooking }) {
  const spec = CONTAINER_SPECS[c.type]
  const route = getRouteById(c.routeId)
  const hasBooking = c.activeBookings.length > 0
  const isMoving = ["in_transit", "at_border", "customs_clearance", "cleared_border"].includes(c.currentPhase)

  return (
    <Link href={`/carrier/containers/${encodeURIComponent(c.id)}`}>
      <Card className={cn(
        "p-4 hover:border-accent/50 transition-colors cursor-pointer",
        hasBooking && "border-accent/20",
      )}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              {isMoving && (
                <span className="flex items-center gap-1 text-[10px] text-accent font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse inline-block" />
                  LIVE
                </span>
              )}
              <p className="font-mono font-semibold text-sm">{c.id}</p>
            </div>
            <p className="text-xs text-muted-foreground">{spec?.nameVi} · {route?.name ?? c.routeId}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasBooking && (
              <Badge variant="outline" className="text-[10px] border-accent/40 text-accent h-5">
                {c.activeBookings.length} booking
              </Badge>
            )}
            {!hasBooking && c.utilizationPercent === 0 && c.currentPhase === "booked" ? (
              <Badge variant="outline" className="text-[10px] border-success/40 text-success h-5 bg-success/5">
                Mở nhận hàng
              </Badge>
            ) : (
              <StatusBadge status={c.currentPhase} />
            )}
          </div>
        </div>

        {/* Utilization */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Utilization</span>
            <span className={cn(
              "text-xs font-semibold tabular-nums",
              c.utilizationPercent >= 80 ? "text-success" : c.utilizationPercent > 0 ? "text-accent" : "text-muted-foreground"
            )}>
              {c.utilizationPercent.toFixed(1)}%
            </span>
          </div>
          <UtilizationBar value={c.utilizationPercent} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Sức chứa: {formatNumber(c.capacityKg)} kg · {c.capacityM3} m³</span>
          <span>Set-point: {c.temperatureSetpointC}°C</span>
          <span>Khởi hành: {formatDateTime(c.departureDate)}</span>
          {c.currentPosition ? (
            <span className="flex items-center gap-1 text-accent">
              <Navigation className="h-3 w-3" />
              {c.currentPosition.lat.toFixed(3)}, {c.currentPosition.lng.toFixed(3)}
              {c.currentPosition.speedKmh ? ` · ${c.currentPosition.speedKmh} km/h` : ""}
            </span>
          ) : (
            <span><PriceDisplay amountVnd={c.pricePerCubicMeter} size="sm" className="inline" /> /m³</span>
          )}
        </div>

        {/* Available capacity for empty containers */}
        {!hasBooking && c.utilizationPercent === 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Còn trống toàn bộ</span>
            <span className="text-xs font-medium text-success">{c.capacityM3} m³ · {formatNumber(c.capacityKg)} kg</span>
          </div>
        )}

        {/* Available remaining capacity for partially booked */}
        {hasBooking && c.utilizationPercent < 100 && c.availableForConsolidation && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs flex items-center gap-1 text-accent">
              <Zap className="h-3 w-3" />Cho ghép thêm
            </span>
            <span className="text-xs font-medium">
              còn {(c.capacityM3 * (1 - c.utilizationPercent / 100)).toFixed(1)} m³
            </span>
          </div>
        )}
      </Card>
    </Link>
  )
}

export default function CarrierContainersPage() {
  const [user, setUser] = useState<User | null>(null)
  const [containers, setContainers] = useState<ContainerWithBooking[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (!u) return

    const allBookings = getBookings()
    const enriched: ContainerWithBooking[] = getContainers()
      .filter((c) => c.carrierId === u.id)
      .map((c) => ({
        ...c,
        activeBookings: allBookings.filter(
          (b) => b.containerId === c.id && ["confirmed", "in_progress"].includes(b.status)
        ),
      }))
    setContainers(enriched)
  }, [])

  const filtered = containers.filter((c) =>
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    (getRouteById(c.routeId)?.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const booked = filtered.filter((c) => c.activeBookings.length > 0 || c.utilizationPercent > 0)
  const empty = filtered.filter((c) => c.activeBookings.length === 0 && c.utilizationPercent === 0)
  const inTransit = filtered.filter((c) =>
    ["in_transit", "at_border", "customs_clearance", "cleared_border", "at_destination"].includes(c.currentPhase)
  )

  if (!user) return null

  return (
    <DashboardShell requiredRole="carrier">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Container của bạn</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{containers.length} cont đang quản lý</p>
          </div>
          <Button asChild>
            <Link href="/carrier/containers/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Publish chuyến mới
            </Link>
          </Button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tổng số cont",       value: containers.length,  icon: Package,  color: "" },
            { label: "Đã có booking",       value: booked.length,      icon: Truck,    color: "text-accent" },
            { label: "Còn trống",           value: empty.length,       icon: Zap,      color: "text-warning" },
            { label: "Đang vận chuyển",     value: inTransit.length,   icon: Navigation, color: "text-success" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-3 flex items-center gap-3">
              <Icon className={cn("h-5 w-5 flex-shrink-0", color || "text-muted-foreground")} />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={cn("text-xl font-bold tabular-nums leading-tight", color)}>{value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm số cont hoặc tuyến đường..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả ({filtered.length})</TabsTrigger>
            <TabsTrigger value="booked">Đã book ({booked.length})</TabsTrigger>
            <TabsTrigger value="empty">Còn trống ({empty.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {filtered.length === 0 ? (
              <EmptyState title="Không có cont nào" description="Thêm từ khoá khác hoặc publish chuyến mới."
                action={{ label: "Publish chuyến mới", href: "/carrier/containers/new" }} />
            ) : (
              <div className="grid gap-3">
                {filtered.map((c) => <ContainerCard key={c.id} c={c} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="booked" className="mt-0">
            {booked.length === 0 ? (
              <EmptyState title="Chưa có cont nào được book" description="Khi exporter book cont, chúng sẽ hiện ở đây." />
            ) : (
              <div className="grid gap-3">
                {booked.map((c) => <ContainerCard key={c.id} c={c} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="empty" className="mt-0">
            {empty.length === 0 ? (
              <EmptyState title="Không có cont trống" description="Tất cả cont đều đã có booking." />
            ) : (
              <div className="grid gap-3">
                {empty.map((c) => <ContainerCard key={c.id} c={c} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
