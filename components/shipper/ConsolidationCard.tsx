"use client"

import { CheckCircle2, AlertTriangle, Package, Gauge } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RouteMapPreview } from "@/components/map/RouteMapPreview"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { RslBadge } from "@/components/shipper/RslIndicator"
import { PRODUCTS, CONTAINER_SPECS } from "@/lib/constants"
import { getRouteById } from "@/lib/data-store"
import { cn, formatNumber } from "@/lib/utils"
import type { ConsolidationSuggestion } from "@/lib/types"

interface ConsolidationCardProps {
  suggestion: ConsolidationSuggestion
  rank: number
  onSelect: (suggestion: ConsolidationSuggestion) => void
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-success border-success/30 bg-success/10"
    : score >= 60 ? "text-warning border-warning/30 bg-warning/10"
    : "text-muted-foreground"
  return <span className={cn("text-xs font-medium border rounded-full px-2 py-0.5", color)}>{score}/100</span>
}

export function ConsolidationCard({ suggestion, rank, onSelect }: ConsolidationCardProps) {
  const { container, matchedShipments, utilizationPercent, compatibilityScore, reasons, warnings, totalWeightKg, totalVolumeM3 } = suggestion
  const spec = CONTAINER_SPECS[container.type]
  const route = getRouteById(container.routeId)

  const totalPrice = matchedShipments
    .find((s) => s)
    ?.volumeM3
    ? suggestion.totalVolumeM3 * container.pricePerCubicMeter
    : 0

  return (
    <Card className={cn("p-5", rank === 1 && "border-accent/60 bg-accent/[0.02]")}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {rank === 1 && <Badge className="text-[10px] bg-accent text-accent-foreground h-4 px-1.5">Gợi ý tốt nhất</Badge>}
            <p className="font-mono text-sm font-medium">{container.id}</p>
          </div>
          <p className="text-xs text-muted-foreground">{container.carrierName} · {spec?.nameVi}</p>
        </div>
        <ScoreBadge score={compatibilityScore} />
      </div>

      {/* Mini map */}
      {route && (
        <RouteMapPreview
          route={route}
          currentPhase={container.currentPhase}
          containerId={container.id}
          size="sm"
          className="mb-4"
        />
      )}

      {/* Shipments in this consolidation */}
      <div className="mb-4 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">{matchedShipments.length} lô hàng được ghép</p>
        {matchedShipments.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-sm">
            <Package className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="flex-1">{PRODUCTS[s.productType]?.nameVi} — {s.shipperName}</span>
            <RslBadge rsl={s.rsl} />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/40 rounded-md">
        <div>
          <p className="text-[10px] text-muted-foreground">Tổng KL</p>
          <p className="text-sm font-medium tabular-nums">{formatNumber(totalWeightKg)} kg</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Thể tích</p>
          <p className="text-sm font-medium tabular-nums">{totalVolumeM3} m³</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" /> Utilization</p>
          <p className={cn("text-sm font-medium tabular-nums", utilizationPercent >= 80 ? "text-success" : "text-warning")}>
            {utilizationPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Reasons & warnings */}
      <div className="space-y-1 mb-4">
        {reasons.map((r, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
            {r}
          </div>
        ))}
        {warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs text-warning">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            {w}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <p className="text-[10px] text-muted-foreground">Ước tính cước</p>
          <PriceDisplay amountVnd={Math.round(totalVolumeM3 * container.pricePerCubicMeter)} size="md" className="font-semibold" />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={rank === 1 ? "default" : "outline"} size="sm">
              Chọn cont này
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận ghép cont (LCL)</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-md">
                    <div><p className="text-xs text-muted-foreground">Container</p><p className="font-mono font-medium">{container.id}</p></div>
                    <div><p className="text-xs text-muted-foreground">Carrier</p><p className="font-medium">{container.carrierName}</p></div>
                    <div><p className="text-xs text-muted-foreground">Thể tích ghép</p><p className="font-medium tabular-nums">{totalVolumeM3} m³</p></div>
                    <div><p className="text-xs text-muted-foreground">Utilization</p><p className={cn("font-medium tabular-nums", utilizationPercent >= 80 ? "text-success" : "text-warning")}>{utilizationPercent.toFixed(1)}%</p></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">{matchedShipments.length} lô hàng trong chuyến này:</p>
                    {matchedShipments.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Package className="h-3 w-3 flex-shrink-0" />
                        <span>{PRODUCTS[s.productType]?.nameVi} — {s.shipperName} — {s.volumeM3} m³</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    Ước tính cước: <span className="font-semibold text-foreground">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Math.round(totalVolumeM3 * container.pricePerCubicMeter))}</span>
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Huỷ</AlertDialogCancel>
              <AlertDialogAction onClick={() => onSelect(suggestion)}>Xác nhận ghép</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  )
}
