"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User as UserIcon, Package, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { ErrorState } from "@/components/shared/ErrorState"
import { getBookings, saveBooking, saveShipment, getContainerById, getShipments, getUserById } from "@/lib/data-store"
import { formatDateTime, formatRelative, formatNumber } from "@/lib/utils"
import { PRODUCTS } from "@/lib/constants"
import type { Booking, Container, Shipment, User } from "@/lib/types"

export default function CarrierBookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined)
  const [container, setContainer] = useState<Container | undefined>(undefined)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [shipper, setShipper] = useState<User | undefined>(undefined)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    const b = getBookings().find((bk) => bk.id === id)
    setBooking(b ?? null)
    if (b) {
      setContainer(getContainerById(b.containerId))
      setShipper(getUserById(b.shipperId))
      const allShipments = getShipments()
      setShipments(allShipments.filter((s) => b.shipmentIds.includes(s.id)))
    }
  }, [id])

  if (booking === undefined) return null
  if (!booking) {
    return <DashboardShell><ErrorState title="Không tìm thấy booking" homeHref="/carrier/bookings" /></DashboardShell>
  }

  async function handleConfirm() {
    if (!booking) return
    setActing(true)
    await new Promise((r) => setTimeout(r, 800))
    const updated = { ...booking, status: "awaiting_payment" as const, confirmedAt: new Date().toISOString() }
    saveBooking(updated)
    setBooking(updated)
    toast.success("Đã xác nhận booking!", {
      description: "Exporter sẽ nhận thông báo và cần thanh toán để hoàn tất.",
    })
    setActing(false)
  }

  async function handleComplete() {
    if (!booking) return
    setActing(true)
    await new Promise((r) => setTimeout(r, 800))
    const updated = { ...booking, status: "completed" as const, completedAt: new Date().toISOString() }
    saveBooking(updated)
    setBooking(updated)
    toast.success("Đã đánh dấu hoàn thành!")
    setActing(false)
  }

  return (
    <DashboardShell requiredRole="carrier">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/carrier/bookings"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <p className="font-mono font-semibold">{booking.id}</p>
            <p className="text-sm text-muted-foreground">{formatRelative(booking.bookedAt)}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Exporter info */}
        <Card className="p-5 space-y-4">
          <p className="font-medium flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-primary" />
            Thông tin exporter
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-muted-foreground">Tên</p><p className="font-medium">{shipper?.name ?? booking.shipperId}</p></div>
            <div><p className="text-xs text-muted-foreground">Điện thoại</p><p className="font-medium">{shipper?.phone ?? "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">Loại booking</p><p className="font-medium">{booking.type === "fcl" ? "Nguyên cont (FCL)" : "Ghép cont (LCL)"}</p></div>
            <div><p className="text-xs text-muted-foreground">Cont</p><p className="font-mono font-medium">{booking.containerId}</p></div>
          </div>
        </Card>

        {/* Shipments */}
        {shipments.length > 0 && (
          <Card className="p-5">
            <p className="font-medium flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-accent" />
              Lô hàng ({shipments.length})
            </p>
            <div className="space-y-3">
              {shipments.map((s) => {
                const product = PRODUCTS[s.productType]
                return (
                  <div key={s.id} className="p-3 bg-muted/40 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{product?.nameVi ?? s.productType}</p>
                      <p className="text-xs text-muted-foreground">RSL {s.rsl} ngày</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(s.weightKg)} kg · {s.volumeM3} m³ · {s.temperatureRequiredC}°C
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{s.originCity} → {s.destination}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Pricing */}
        <Card className="p-5">
          <p className="font-medium mb-4">Thanh toán</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Tổng cước phí</p>
            <PriceDisplay amountVnd={booking.totalPriceVnd} size="lg" />
          </div>
          {booking.confirmedAt && (
            <>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">Xác nhận lúc: {formatDateTime(booking.confirmedAt)}</p>
            </>
          )}
          {booking.completedAt && (
            <p className="text-xs text-muted-foreground">Hoàn thành lúc: {formatDateTime(booking.completedAt)}</p>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {booking.status === "pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" disabled={acting}>
                  {acting ? "Đang xử lý..." : "Xác nhận booking"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn sẽ xác nhận booking <span className="font-mono font-medium">{booking.id}</span> từ{" "}
                    <span className="font-medium">{shipper?.name ?? booking.shipperId}</span>.
                    Sau khi xác nhận, exporter sẽ nhận được thông báo và chuyến hàng sẽ được lên lịch.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Huỷ</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {booking.status === "in_progress" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" disabled={acting}>
                  {acting ? "Đang xử lý..." : "Đánh dấu hoàn thành"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Đánh dấu chuyến đã hoàn thành?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Xác nhận rằng chuyến hàng <span className="font-mono font-medium">{booking.id}</span> đã được giao thành công.
                    Exporter sẽ được mời đánh giá dịch vụ của bạn.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Huỷ</AlertDialogCancel>
                  <AlertDialogAction onClick={handleComplete}>Hoàn thành</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
