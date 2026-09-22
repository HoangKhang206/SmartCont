import Link from "next/link"
import { MapPin, Calendar, Thermometer, Package, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RslBadge } from "@/components/shipper/RslIndicator"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { PRODUCTS } from "@/lib/constants"
import type { Shipment } from "@/lib/types"

interface ShipmentCardProps {
  shipment: Shipment
  pendingBookingId?: string
}

function rslPriorityClass(rsl: number): string {
  if (rsl <= 7)  return "border-l-4 border-l-danger/70"
  if (rsl <= 14) return "border-l-4 border-l-warning/60"
  return "border-l-4 border-l-success/50"
}

function rslPriorityDot(rsl: number): string {
  if (rsl <= 7)  return "🔴"
  if (rsl <= 14) return "🟡"
  return "🟢"
}

export function ShipmentCard({ shipment, pendingBookingId }: ShipmentCardProps) {
  const product = PRODUCTS[shipment.productType]
  const hasPendingBooking = !!pendingBookingId

  return (
    <Link href={`/shipper/shipments/${shipment.id}`}>
      <Card className={`p-4 hover:border-accent/50 transition-colors cursor-pointer ${rslPriorityClass(shipment.rsl)}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-medium text-sm">
              <span className="mr-1.5">{rslPriorityDot(shipment.rsl)}</span>
              {product?.nameVi ?? shipment.productType}
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{shipment.id}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <RslBadge rsl={shipment.rsl} />
            {hasPendingBooking ? (
              <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/15 text-warning border-warning/30 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Chờ xác nhận
              </Badge>
            ) : (
              <StatusBadge status={shipment.status} />
            )}
          </div>
        </div>

        {hasPendingBooking && (
          <div className="mb-2 px-2.5 py-1.5 rounded-md bg-warning/8 border border-warning/20 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-warning flex-shrink-0" />
            <p className="text-xs text-warning">Đã gửi yêu cầu book — carrier đang xem xét</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            {(shipment.weightKg / 1000).toFixed(1)} tấn · {shipment.volumeM3} m³
          </span>
          <span className="flex items-center gap-1.5">
            <Thermometer className="h-3.5 w-3.5" />
            {shipment.temperatureRequiredC}°C set-point
          </span>
          <span className="flex items-center gap-1.5 col-span-2">
            <MapPin className="h-3.5 w-3.5" />
            {shipment.originCity} → {shipment.destinationBorder}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Deadline: {formatDate(shipment.deadlineDate)}
          </span>
        </div>
      </Card>
    </Link>
  )
}
