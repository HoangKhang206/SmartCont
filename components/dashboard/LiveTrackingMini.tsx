"use client"

import Link from "next/link"
import { Thermometer, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getBookings, getContainerById, getShipments, getRouteById } from "@/lib/data-store"
import type { User } from "@/lib/types"

interface LiveTrackingMiniProps {
  user: User
}

const PHASE_LABELS: Record<string, string> = {
  booked:                "Đã book",
  en_route_to_warehouse: "Đến kho",
  at_warehouse:          "Tại kho",
  loading:               "Đang xếp",
  in_transit:            "In Transit",
  at_border:             "Tại CK",
  customs_clearance:     "Thông quan",
  cleared_border:        "Đã qua CK",
  at_destination:        "Đến nơi",
  delivered:             "Hoàn thành",
}

function fakeTemp(containerId: string): number {
  const seed = containerId.charCodeAt(containerId.length - 1)
  return 14 + (seed % 5) + Math.round(Math.random() * 10) / 10
}

function fakeEta(containerId: string): string {
  const hours = [8, 12, 18, 24, 28, 36, 42]
  const idx = containerId.charCodeAt(0) % hours.length
  return `${hours[idx]}h`
}

export function LiveTrackingMini({ user }: LiveTrackingMiniProps) {
  const bookings = getBookings().filter(
    (b) => b.shipperId === user.id && (b.status === "in_progress" || b.status === "confirmed")
  )

  const items = bookings.slice(0, 4).map((b) => {
    const container = getContainerById(b.containerId)
    const shipments = getShipments().filter((s) => b.shipmentIds.includes(s.id))
    return { booking: b, container, shipments }
  })

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs text-muted-foreground">Không có cont đang vận chuyển</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map(({ booking, container, shipments }) => {
        const phase = container?.currentPhase ?? "in_transit"
        const route = container ? getRouteById(container.routeId) : undefined
        const origin = shipments[0]?.originCity ?? route?.originCity ?? "—"
        const dest = route?.destinationCity ?? "Hữu Nghị"
        const temp = fakeTemp(booking.containerId)
        const eta = fakeEta(booking.containerId)
        const isOnTime = phase !== "at_border"

        return (
          <Link
            key={booking.id}
            href={`/shipper/tracking/${encodeURIComponent(booking.containerId)}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all group"
          >
            {/* Status dot */}
            <div className={cn(
              "h-2 w-2 rounded-full flex-shrink-0",
              isOnTime ? "bg-success" : "bg-warning"
            )} />

            {/* Route */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                <span className="truncate max-w-[60px]">{origin}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
                <span className="truncate max-w-[60px]">{dest}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">{booking.containerId}</p>
            </div>

            {/* Phase badge */}
            <Badge
              variant="outline"
              className="text-[9px] h-4 px-1.5 flex-shrink-0 hidden sm:flex border-accent/30 text-accent bg-accent/5"
            >
              {PHASE_LABELS[phase] ?? phase}
            </Badge>

            {/* Temp */}
            <div className="flex items-center gap-1 text-[10px] text-cold flex-shrink-0">
              <Thermometer className="h-3 w-3" />
              <span className="tabular-nums font-medium">{temp.toFixed(1)}°C</span>
            </div>

            {/* ETA */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
              <Clock className="h-3 w-3" />
              <span className="tabular-nums">{eta}</span>
            </div>

            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground flex-shrink-0 transition-colors" />
          </Link>
        )
      })}

      {bookings.length > 4 && (
        <p className="text-center text-[10px] text-muted-foreground pt-1">
          +{bookings.length - 4} cont khác đang vận chuyển
        </p>
      )}
    </div>
  )
}
