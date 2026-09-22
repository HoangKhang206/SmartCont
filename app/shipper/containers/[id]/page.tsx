"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Snowflake, MapPin, Calendar, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { StarRating } from "@/components/shared/StarRating"
import { ErrorState } from "@/components/shared/ErrorState"
import { getContainerById, getRatings, getRouteById, getCurrentUser, saveBooking, saveShipment, getShipments, getUserById, getCarrierAutoConfirm } from "@/lib/data-store"
import { CONTAINER_SPECS, ROUTE_BASE_HOURS } from "@/lib/constants"
import { formatDateTime, formatNumber, generateId } from "@/lib/utils"
import type { Container, Rating, User } from "@/lib/types"

const RouteMap = dynamic(() => import("@/components/map/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="h-52 rounded-lg border border-border bg-muted/50 animate-pulse flex items-center justify-center">
      <span className="text-xs text-muted-foreground">Đang tải bản đồ...</span>
    </div>
  ),
})

function ContainerDetailContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const shipmentId = searchParams.get("shipmentId") ?? undefined
  const containerId = decodeURIComponent(id)
  const [container, setContainer] = useState<Container | null | undefined>(undefined)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [carrier, setCarrier] = useState<User | undefined>(undefined)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const c = getContainerById(containerId)
    setContainer(c ?? null)
    if (c) {
      setRatings(getRatings().filter((r) => r.carrierId === c.carrierId).slice(0, 3))
      setCarrier(getUserById(c.carrierId))
    }
  }, [containerId])

  if (container === undefined) return null
  if (!container) return <DashboardShell><ErrorState title="Không tìm thấy cont" homeHref="/shipper/containers" /></DashboardShell>

  const spec = CONTAINER_SPECS[container.type]
  const route = getRouteById(container.routeId)
  const routeKey = container.routeId.replace("route_", "")
  const baseHours = ROUTE_BASE_HOURS[routeKey] ?? 34
  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.overallScore, 0) / ratings.length : 0

  async function handleBook() {
    if (!container) return
    const user = getCurrentUser()
    if (!user) return
    setBooking(true)
    await new Promise((r) => setTimeout(r, 700))

    const allPending = getShipments().filter((s) => s.shipperId === user.id && s.status === "pending_match")
    // Prefer the shipment the user came from; fall back to first pending
    const target = shipmentId
      ? allPending.find((s) => s.id === shipmentId) ?? allPending[0]
      : allPending[0]
    const pendingShipments = target ? [target] : []
    const shipmentIds = pendingShipments.map((s) => s.id)

    const autoConfirm = getCarrierAutoConfirm(container.carrierId)
    const bookingId = generateId("booking")
    saveBooking({
      id: bookingId,
      type: "fcl",
      shipperId: user.id,
      containerId: container.id,
      shipmentIds,
      totalPriceVnd: container.priceForFullContainer,
      status: autoConfirm ? "awaiting_payment" : "pending",
      bookedAt: new Date().toISOString(),
    })

    if (autoConfirm) {
      toast.success("Booking đã được tạo!", {
        description: `Mã booking: ${bookingId} — Vui lòng thanh toán để xác nhận chuyến.`,
      })
      router.push(`/payment/${bookingId}`)
    } else {
      toast.info("Đã gửi yêu cầu book!", {
        description: `Mã booking: ${bookingId} — Carrier đang xem xét, thường phản hồi trong 15 phút.`,
      })
      router.push(`/shipper/shipments`)
    }
  }

  return (
    <DashboardShell requiredRole="shipper">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/shipper/containers"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <p className="font-mono text-xl font-semibold">{container.id}</p>
            <p className="text-sm text-muted-foreground">{container.carrierName}</p>
          </div>
          <StatusBadge status={container.currentPhase} />
        </div>

        {/* Main info */}
        <Card className="p-5 space-y-4">
          <p className="font-medium">Thông tin container</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Loại cont</p><p className="font-medium">{spec?.nameVi}</p></div>
            <div><p className="text-xs text-muted-foreground">Sức chứa</p><p className="font-medium tabular-nums">{formatNumber(container.capacityKg)} kg · {container.capacityM3} m³</p></div>
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-cold" />
              <div><p className="text-xs text-muted-foreground">Set-point</p><p className="font-medium">{container.temperatureSetpointC}°C</p></div>
            </div>
            <div><p className="text-xs text-muted-foreground">ETA baseline</p><p className="font-medium">~{baseHours}h</p></div>
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

          {/* Carrier contact */}
          {carrier?.phone && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Liên hệ carrier</p>
                  <p className="text-sm font-medium">{carrier.name}</p>
                  <p className="text-xs text-muted-foreground">{carrier.phone}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                  <a href={`tel:${carrier.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-3.5 w-3.5" />
                    Gọi ngay
                  </a>
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Map — vị trí cont hiện tại */}
        {route && (
          <RouteMap
            route={route}
            currentPhase={container.currentPhase}
            containerId={container.id}
            height="220px"
            interactive={true}
          />
        )}

        {/* Pricing */}
        <Card className="p-5">
          <p className="font-medium mb-4">Giá cước</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Ghép cont / m³</p>
              <PriceDisplay amountVnd={container.pricePerCubicMeter} size="lg" />
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Nguyên cont (FCL)</p>
              <PriceDisplay amountVnd={container.priceForFullContainer} size="lg" />
            </div>
          </div>
        </Card>

        {/* Carrier ratings */}
        {ratings.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Đánh giá carrier</p>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold tabular-nums">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({ratings.length} đánh giá)</span>
              </div>
            </div>
            <div className="space-y-4">
              {ratings.map((r) => (
                <div key={r.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{r.shipperName}</p>
                    <StarRating value={r.overallScore} readOnly size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.reviewText}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Book action */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" size="lg" disabled={booking}>
              {booking ? "Đang xử lý..." : "Book cont này — FCL"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận book nguyên cont (FCL)</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-md">
                    <div><p className="text-xs text-muted-foreground">Container</p><p className="font-mono font-medium">{container.id}</p></div>
                    <div><p className="text-xs text-muted-foreground">Carrier</p><p className="font-medium">{container.carrierName}</p></div>
                    <div><p className="text-xs text-muted-foreground">Tuyến</p><p className="font-medium">{route?.name ?? container.routeId}</p></div>
                    <div><p className="text-xs text-muted-foreground">Khởi hành</p><p className="font-medium">{formatDateTime(container.departureDate)}</p></div>
                  </div>
                  <p className="text-muted-foreground">
                    Tổng cước: <span className="font-semibold text-foreground">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(container.priceForFullContainer)}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">Sau khi xác nhận, carrier sẽ liên hệ trong vòng 15 phút.</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Huỷ</AlertDialogCancel>
              <AlertDialogAction onClick={handleBook}>Xác nhận book</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardShell>
  )
}

export default function ContainerDetailPage() {
  return (
    <Suspense fallback={null}>
      <ContainerDetailContent />
    </Suspense>
  )
}
