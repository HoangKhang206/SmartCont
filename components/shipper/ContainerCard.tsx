import Link from "next/link"
import { Snowflake, MapPin, Calendar, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LiveIndicator } from "@/components/shared/LiveIndicator"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { CarrierRatingBadge } from "@/components/shipper/CarrierRatingBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { formatDateTime } from "@/lib/utils"
import { CONTAINER_SPECS, ROUTE_BASE_HOURS } from "@/lib/constants"
import { getRouteById } from "@/lib/data-store"
import type { Container } from "@/lib/types"

interface ContainerCardProps {
  container: Container
  shipmentId?: string
}

export function ContainerCard({ container, shipmentId }: ContainerCardProps) {
  const spec = CONTAINER_SPECS[container.type]
  const route = getRouteById(container.routeId)

  const routeKey = container.routeId.replace("route_", "")
  const baseHours = ROUTE_BASE_HOURS[routeKey] ?? 34

  return (
    <Card className="p-5 hover:border-accent/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {container.currentPhase === "in_transit" && <LiveIndicator />}
            <p className="font-mono text-sm font-medium">{container.id}</p>
          </div>
          <p className="text-xs text-muted-foreground">{container.carrierName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-medium">{spec?.nameVi}</Badge>
          <StatusBadge status={container.currentPhase} />
        </div>
      </div>

      {/* Route + info */}
      <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{route?.name ?? container.routeId}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Khởi hành: {formatDateTime(container.departureDate)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Snowflake className="h-3.5 w-3.5 text-cold" />
            {container.temperatureSetpointC}°C
          </span>
          <span>{container.capacityM3} m³</span>
          <span>ETA ~{baseHours}h</span>
          {container.availableForConsolidation && (
            <span className="flex items-center gap-1 text-accent">
              <Zap className="h-3 w-3" /> Cho ghép
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground">Ghép cont/m³</p>
            <PriceDisplay amountVnd={container.pricePerCubicMeter} size="sm" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Nguyên cont</p>
            <PriceDisplay amountVnd={container.priceForFullContainer} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CarrierRatingBadge carrierId={container.carrierId} />
          <Button size="sm" asChild>
            <Link href={`/shipper/containers/${encodeURIComponent(container.id)}${shipmentId ? `?shipmentId=${shipmentId}` : ""}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
