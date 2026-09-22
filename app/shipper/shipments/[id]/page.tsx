"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, GitMerge, MapPin, Package, Thermometer, Calendar, User as UserIcon, Phone, Users, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RslIndicator, RslBadge } from "@/components/shipper/RslIndicator"
import { ErrorState } from "@/components/shared/ErrorState"
import { getShipments, getBookings, getContainerById, getUserById } from "@/lib/data-store"
import { PRODUCTS } from "@/lib/constants"
import { formatDate, formatRelative, formatNumber } from "@/lib/utils"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { Badge } from "@/components/ui/badge"
import { Truck } from "lucide-react"
import type { Shipment, Booking, User, Container } from "@/lib/types"

const MS_LABELS: Record<number, string> = {
  1: "Xanh non (1/5)",
  2: "Xanh chín (2/5)",
  3: "Chín thương mại (3/5)",
  4: "Chín kỹ (4/5)",
  5: "Chín hoàn toàn (5/5)",
}

function maturityLabel(ms: number): string {
  return MS_LABELS[ms] ?? `${ms}/5`
}

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null | undefined>(undefined)
  const [booking, setBooking] = useState<Booking | undefined>(undefined)
  const [container, setContainer] = useState<Container | undefined>(undefined)
  const [carrier, setCarrier] = useState<User | undefined>(undefined)
  const [coShippers, setCoShippers] = useState<{ shipment: Shipment; shipper: User | undefined }[]>([])

  useEffect(() => {
    const s = getShipments().find((x) => x.id === id) ?? null
    setShipment(s)
    if (!s) return

    const b = getBookings().find((bk) => bk.shipmentIds.includes(s.id))
    setBooking(b)

    if (b) {
      const c = getContainerById(b.containerId)
      setContainer(c)
      if (c) setCarrier(getUserById(c.carrierId))

      // Co-shippers for consolidation
      if (b.type === "consolidation") {
        const allShipments = getShipments()
        const others = b.shipmentIds
          .filter((sid) => sid !== s.id)
          .map((sid) => {
            const sh = allShipments.find((x) => x.id === sid)
            return sh ? { shipment: sh, shipper: getUserById(sh.shipperId) } : null
          })
          .filter(Boolean) as { shipment: Shipment; shipper: User | undefined }[]
        setCoShippers(others)
      }
    }
  }, [id])

  if (shipment === undefined) return null
  if (shipment === null) {
    return <DashboardShell><ErrorState title="Không tìm thấy lô hàng" homeHref="/shipper/shipments" /></DashboardShell>
  }

  const product = PRODUCTS[shipment.productType]

  return (
    <DashboardShell requiredRole="shipper">
      <div className="max-w-2xl space-y-6">
        {/* Back */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/shipper/shipments"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{product?.nameVi ?? shipment.productType}</h1>
            <p className="text-xs text-muted-foreground font-mono">{shipment.id}</p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        {/* RSL */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Remaining Shelf Life</p>
            <RslBadge rsl={shipment.rsl} />
          </div>
          <RslIndicator rsl={shipment.rsl} showLabel={false} />
          <p className="text-xs text-muted-foreground mt-2">
            Tính theo mô hình ASLT kinetics — cắt {formatDate(shipment.harvestDate)}, DAA {shipment.daa} ngày, MS {shipment.maturityScore}/5, bảo quản {shipment.temperatureRequiredC}°C
          </p>
        </Card>

        {/* Details */}
        <Card className="p-5 space-y-4">
          <p className="font-medium">Thông tin lô hàng</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Khối lượng</p>
                <p className="font-medium tabular-nums">{formatNumber(shipment.weightKg)} kg</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Thể tích</p>
                <p className="font-medium tabular-nums">{shipment.volumeM3} m³</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Thermometer className="h-4 w-4 text-cold mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Nhiệt độ bảo quản</p>
                <p className="font-medium">{shipment.temperatureRequiredC}°C</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Độ chín (MS)</p>
                <p className="font-medium">{maturityLabel(shipment.maturityScore)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">DAA (ngày sau ra hoa)</p>
                <p className="font-medium tabular-nums">{shipment.daa} ngày</p>
              </div>
            </div>
            <div className="flex items-start gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Tuyến</p>
                <p className="font-medium">{shipment.originCity} → {shipment.destinationBorder}</p>
                <p className="text-xs text-muted-foreground">{shipment.originAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Deadline</p>
                <p className="font-medium">{formatDate(shipment.deadlineDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Tạo lúc</p>
                <p className="font-medium">{formatRelative(shipment.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Durian compliance codes */}
        {(shipment.growingAreaCode || shipment.packingFacilityCode) && (
          <Card className="p-4 border-success/30 bg-success/5">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="text-sm font-medium text-success">Mã kiểm dịch Cục BVTV</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {shipment.growingAreaCode && (
                <div>
                  <p className="text-xs text-muted-foreground">Mã số vùng trồng</p>
                  <p className="font-mono font-medium mt-0.5">{shipment.growingAreaCode}</p>
                </div>
              )}
              {shipment.packingFacilityCode && (
                <div>
                  <p className="text-xs text-muted-foreground">Mã số cơ sở đóng gói</p>
                  <p className="font-mono font-medium mt-0.5">{shipment.packingFacilityCode}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Booking chờ xác nhận */}
        {booking && booking.status === "pending" && (
          <Card className="p-5 border-warning/40 bg-warning/5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-warning">Đang chờ carrier xác nhận</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mã yêu cầu: <span className="font-mono">{booking.id}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Đã gửi {new Date(booking.bookedAt).toLocaleString("vi-VN")} — Carrier thường phản hồi trong 15 phút.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Booking chờ thanh toán */}
        {booking && booking.status === "awaiting_payment" && (
          <Card className="p-5 border-accent/40 bg-accent/5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-accent">Cần thanh toán để xác nhận chuyến</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mã booking: <span className="font-mono">{booking.id}</span>
                </p>
              </div>
              <Button size="sm" asChild>
                <a href={`/payment/${booking.id}`}>Thanh toán ngay</a>
              </Button>
            </div>
          </Card>
        )}

        {/* Booking info (khi đã book) */}
        {booking && booking.status !== "pending" && booking.status !== "awaiting_payment" && shipment.containerId && (
          <Card className="p-5 space-y-4">
            <p className="font-medium flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" />
              Thông tin booking
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Loại</p>
                <Badge
                  variant="outline"
                  className={booking.type === "fcl"
                    ? "mt-1 border-accent/40 text-accent"
                    : "mt-1 border-cold/40 text-cold"}
                >
                  {booking.type === "fcl" ? "Nguyên cont (FCL)" : "Ghép cont (LCL)"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mã booking</p>
                <p className="font-mono text-xs mt-0.5">{booking.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Container</p>
                <p className="font-mono font-medium">{shipment.containerId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cước phí</p>
                <PriceDisplay amountVnd={booking.totalPriceVnd} size="sm" />
              </div>
            </div>

            {/* Carrier contact */}
            {carrier && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bên vận chuyển</p>
                    <p className="text-sm font-medium">{carrier.name}</p>
                    {carrier.phone && (
                      <p className="text-xs text-muted-foreground">{carrier.phone}</p>
                    )}
                  </div>
                  {carrier.phone && (
                    <Button size="sm" variant="outline" className="gap-1.5" asChild>
                      <a href={`tel:${carrier.phone.replace(/\s/g, "")}`}>
                        <Phone className="h-3.5 w-3.5" />
                        Gọi ngay
                      </a>
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Co-shippers (consolidation only) */}
            {booking.type === "consolidation" && coShippers.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Các chủ vựa ghép cùng chuyến ({coShippers.length})
                  </p>
                  <div className="space-y-2">
                    {coShippers.map(({ shipment: s, shipper }) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md">
                        <div>
                          <p className="text-sm font-medium">{shipper?.name ?? s.shipperId}</p>
                          <p className="text-xs text-muted-foreground">
                            {PRODUCTS[s.productType]?.nameVi} · {s.volumeM3} m³
                            {shipper?.location ? ` · ${shipper.location}` : ""}
                          </p>
                        </div>
                        {shipper?.phone && (
                          <Button size="sm" variant="ghost" className="h-7 px-2 gap-1 text-xs" asChild>
                            <a href={`tel:${shipper.phone.replace(/\s/g, "")}`}>
                              <Phone className="h-3 w-3" />
                              {shipper.phone}
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Actions */}
        {shipment.status === "pending_match" && !booking && (
          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <Link href={`/shipper/consolidation?shipmentId=${shipment.id}`}>
                <GitMerge className="h-4 w-4 mr-2" />
                Tìm ghép cont
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/shipper/containers?shipmentId=${shipment.id}`}>
                Tìm cont nguyên
              </Link>
            </Button>
          </div>
        )}

        {shipment.containerId && (
          <Button asChild className="w-full">
            <Link href={`/shipper/tracking/${encodeURIComponent(shipment.containerId)}`}>
              <MapPin className="h-4 w-4 mr-2" />
              Xem tracking cont {shipment.containerId}
            </Link>
          </Button>
        )}
      </div>
    </DashboardShell>
  )
}
