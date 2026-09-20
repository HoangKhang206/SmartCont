"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft, AlertTriangle, Snowflake, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { PhaseUpdateButtons } from "@/components/carrier/PhaseUpdateButtons"
import { ErrorState } from "@/components/shared/ErrorState"
import { getCurrentUser, getContainerById, getBookings, getUserById, getIncidents, getRouteById } from "@/lib/data-store"
import { CONTAINER_SPECS, PHASE_LABELS } from "@/lib/constants"
import { formatDateTime, formatNumber, formatRelative } from "@/lib/utils"
import type { User, Container, Booking, Incident, Route } from "@/lib/types"

const RouteMapPreview = dynamic(
  () => import("@/components/map/RouteMapPreview").then((m) => ({ default: m.RouteMapPreview })),
  {
    ssr: false,
    loading: () => (
      <div className="h-52 rounded-lg border border-border bg-muted/50 animate-pulse" />
    ),
  }
)

export default function CarrierContainerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const containerId = decodeURIComponent(id)
  const [user, setUser] = useState<User | null>(null)
  const [container, setContainer] = useState<Container | null | undefined>(undefined)
  const [route, setRoute] = useState<Route | undefined>(undefined)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    const c = getContainerById(containerId)
    setContainer(c ?? null)
    if (c) {
      setRoute(getRouteById(c.routeId))
      setBookings(getBookings().filter((b) => b.containerId === c.id))
      setIncidents(getIncidents().filter((i) => i.containerId === c.id))
    }
  }, [containerId])

  if (container === undefined || !user) return null
  if (!container) {
    return <DashboardShell><ErrorState title="Không tìm thấy cont" homeHref="/carrier/containers" /></DashboardShell>
  }

  const spec = CONTAINER_SPECS[container.type]

  return (
    <DashboardShell requiredRole="carrier">
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/carrier/containers"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <p className="font-mono text-xl font-semibold">{container.id}</p>
            <p className="text-sm text-muted-foreground">{spec?.nameVi}</p>
          </div>
          <StatusBadge status={container.currentPhase} />
        </div>

        {/* Route preview */}
        {route && (
          <RouteMapPreview
            route={route}
            currentPhase={container.currentPhase}
            currentPosition={container.currentPosition}
            containerId={container.id}
            size="md"
          />
        )}

        {/* Phase update */}
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">Cập nhật hành trình</p>
          <PhaseUpdateButtons
            container={container}
            carrierId={user.id}
            onUpdated={(updated) => setContainer(updated)}
          />
        </Card>

        {/* Info */}
        <Card className="p-5 space-y-4">
          <p className="font-medium">Thông tin container</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Sức chứa</p>
              <p className="font-medium tabular-nums">{formatNumber(container.capacityKg)} kg · {container.capacityM3} m³</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Utilization</p>
              <p className="font-medium tabular-nums">{container.utilizationPercent.toFixed(1)}%</p>
            </div>
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-cold flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Set-point</p>
                <p className="font-medium">{container.temperatureSetpointC}°C</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hình thức</p>
              <p className="font-medium">{container.availableForConsolidation ? "LCL + FCL" : "FCL only"}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Tuyến</p>
                <p className="font-medium">{route?.name ?? container.routeId}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Khởi hành</p>
                <p className="font-medium">{formatDateTime(container.departureDate)}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Giá ghép cont / m³</p>
              <PriceDisplay amountVnd={container.pricePerCubicMeter} size="lg" />
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Giá nguyên cont</p>
              <PriceDisplay amountVnd={container.priceForFullContainer} size="lg" />
            </div>
          </div>
        </Card>

        {/* Bookings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium">Bookings ({bookings.length})</p>
          </div>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Chưa có booking nào.</p>
          ) : (
            <div className="divide-y divide-border">
              {bookings.map((b) => {
                const shipper = getUserById(b.shipperId)
                return (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{shipper?.name ?? b.shipperId}</p>
                      <p className="text-xs text-muted-foreground">{b.type === "fcl" ? "FCL" : "Ghép cont"} · {formatRelative(b.bookedAt)}</p>
                    </div>
                    <div className="text-right">
                      <PriceDisplay amountVnd={b.totalPriceVnd} size="sm" />
                      <Button variant="ghost" size="sm" className="h-7 text-xs mt-1" asChild>
                        <Link href={`/carrier/bookings/${b.id}`}>Xem</Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Incidents */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium">Sự cố ({incidents.length})</p>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/carrier/incidents/new?containerId=${encodeURIComponent(container.id)}`} className="gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Báo sự cố
              </Link>
            </Button>
          </div>
          {incidents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Chưa có sự cố nào. Tuyệt vời!</p>
          ) : (
            <div className="space-y-2">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3 rounded-md border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={inc.severity} />
                    <p className="text-sm font-medium">{inc.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{inc.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelative(inc.reportedAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  )
}
