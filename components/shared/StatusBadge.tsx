import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ShipmentStatus, ContainerPhase, IncidentSeverity } from "@/lib/types"

type AnyStatus = ShipmentStatus | ContainerPhase | IncidentSeverity | "pending" | "awaiting_payment" | "confirmed" | "in_progress" | "completed" | "cancelled"

interface StatusBadgeProps {
  status: AnyStatus
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Shipment statuses
  draft:           { label: "Nháp",              className: "bg-muted text-muted-foreground border-0" },
  pending_match:   { label: "Chờ ghép cont",     className: "bg-warning/15 text-warning border-warning/30" },
  matched:         { label: "Đã book cont",       className: "bg-cold-soft text-cold border-cold/30" },
  in_transit:      { label: "Đang vận chuyển",   className: "bg-accent/10 text-accent border-accent/30" },
  at_border:       { label: "Tại cửa khẩu",      className: "bg-warning/15 text-warning border-warning/30" },
  cleared:         { label: "Đã thông quan",     className: "bg-success/15 text-success border-success/30" },
  delivered:       { label: "Đã giao",           className: "bg-success/15 text-success border-success/30" },
  cancelled:       { label: "Đã huỷ",            className: "bg-danger/15 text-danger border-danger/30" },

  // Container phases
  booked:                { label: "Chờ xuất phát",       className: "bg-muted text-muted-foreground border-0" },
  en_route_to_warehouse: { label: "Đến vựa",           className: "bg-accent/10 text-accent border-accent/30" },
  at_warehouse:          { label: "Tại vựa",           className: "bg-cold-soft text-cold border-cold/30" },
  loading:               { label: "Đang xếp hàng",     className: "bg-warning/15 text-warning border-warning/30" },
  customs_clearance:     { label: "Thông quan",        className: "bg-warning/15 text-warning border-warning/30" },
  cleared_border:        { label: "Qua cửa khẩu",      className: "bg-success/15 text-success border-success/30" },
  at_destination:        { label: "Tại điểm đến",      className: "bg-success/15 text-success border-success/30" },

  // Booking statuses
  pending:           { label: "Chờ xác nhận",  className: "bg-warning/15 text-warning border-warning/30" },
  awaiting_payment:  { label: "Chờ thanh toán", className: "bg-accent/10 text-accent border-accent/30" },
  confirmed:         { label: "Đã xác nhận",    className: "bg-cold-soft text-cold border-cold/30" },
  in_progress: { label: "Đang xử lý",  className: "bg-accent/10 text-accent border-accent/30" },
  completed:   { label: "Hoàn thành",  className: "bg-success/15 text-success border-success/30" },

  // Incident severity
  info:     { label: "Thông tin",    className: "bg-muted text-muted-foreground border-0" },
  warning:  { label: "Cảnh báo",    className: "bg-warning/15 text-warning border-warning/30" },
  critical: { label: "Nghiêm trọng", className: "bg-danger/15 text-danger border-danger/30" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground border-0" }

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
