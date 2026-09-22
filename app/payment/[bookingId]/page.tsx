"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, CreditCard, Loader2, Receipt, Shield } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/shared/Logo"
import {
  getBookings,
  saveBooking,
  getContainerById,
  getShipments,
  saveShipment,
  getCurrentUser,
} from "@/lib/data-store"
import { PRICING, CONTAINER_SPECS } from "@/lib/constants"
import { formatNumber } from "@/lib/utils"
import type { Booking, Container } from "@/lib/types"

const PLATFORM_COMMISSION_RATE = 0.025 // 2.5%
const VAT_RATE = 0.10                   // 10%

function calcBreakdown(freightVnd: number) {
  const freight = freightVnd
  const clearance = PRICING.borderClearanceVnd
  const commission = Math.round(freight * PLATFORM_COMMISSION_RATE)
  const subtotal = freight + clearance + commission
  const vat = Math.round((clearance + commission) * VAT_RATE)
  const total = subtotal + vat
  return { freight, clearance, commission, subtotal, vat, total }
}

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [container, setContainer] = useState<Container | null>(null)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    const b = getBookings().find((x) => x.id === bookingId)
    if (!b) return
    setBooking(b)
    if (b.status === "confirmed" || b.status === "in_progress" || b.status === "completed") {
      setPaid(true)
    }
    const c = getContainerById(b.containerId)
    if (c) setContainer(c)
  }, [bookingId])

  async function handlePay() {
    if (!booking || !container) return
    setPaying(true)
    await new Promise((r) => setTimeout(r, 2200))

    const now = new Date().toISOString()
    const updated: Booking = {
      ...booking,
      status: "confirmed",
      confirmedAt: booking.confirmedAt ?? now,
      paidAt: now,
    }
    saveBooking(updated)

    // Update shipments → matched
    getShipments()
      .filter((s) => booking.shipmentIds.includes(s.id))
      .forEach((s) => saveShipment({ ...s, status: "matched", containerId: container.id }))

    setPaid(true)
    setPaying(false)
    toast.success("Thanh toán thành công!", {
      description: "Booking đã được xác nhận. Carrier sẽ liên hệ trong 15 phút.",
    })

    setTimeout(() => {
      router.push(`/shipper/tracking/${encodeURIComponent(container.id)}`)
    }, 1800)
  }

  if (!booking || !container) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const { freight, clearance, commission, vat, total } = calcBreakdown(booking.totalPriceVnd)
  const spec = CONTAINER_SPECS[container.type]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="md" />
          <Badge variant="outline" className="text-xs border-accent/30 text-accent bg-accent/5">
            Thanh toán bảo mật
          </Badge>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
        {paid ? (
          <Card className="p-8 text-center border-success/30 bg-success/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <p className="font-semibold text-lg mb-1">Thanh toán thành công</p>
            <p className="text-sm text-muted-foreground mb-4">
              Booking <span className="font-mono">{booking.id}</span> đã được xác nhận.
              Đang chuyển đến trang tracking...
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/shipper/tracking/${encodeURIComponent(container.id)}`)}
            >
              Xem tracking ngay
            </Button>
          </Card>
        ) : (
          <>
            {/* Header */}
            <div>
              <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <Receipt className="h-5 w-5 text-accent" />
                Xác nhận thanh toán
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Mã booking: <span className="font-mono text-foreground">{booking.id}</span>
              </p>
            </div>

            {/* Container info */}
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                Thông tin cont
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Container</span>
                  <span className="font-mono font-medium">{container.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại cont</span>
                  <span>{spec?.nameVi ?? container.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span>{container.carrierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tuyến</span>
                  <span>{container.routeId.replace(/_/g, " → ")}</span>
                </div>
              </div>
            </Card>

            {/* Price breakdown */}
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                Chi tiết thanh toán
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá cước cơ bản ({booking.type === "fcl" ? "FCL" : "LCL"})</span>
                  <span className="tabular-nums">{formatNumber(freight)} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí thông quan (ước tính)</span>
                  <span className="tabular-nums">{formatNumber(clearance)} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Hoa hồng nền tảng
                    <span className="ml-1 text-[10px] text-muted-foreground/60">({(PLATFORM_COMMISSION_RATE * 100).toFixed(1)}%)</span>
                  </span>
                  <span className="tabular-nums">{formatNumber(commission)} ₫</span>
                </div>

                <Separator />

                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span className="tabular-nums">{formatNumber(freight + clearance + commission)} ₫</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    VAT (10%){" "}
                    <span className="text-[10px] text-muted-foreground/60">áp dụng trên phí DV + hoa hồng</span>
                  </span>
                  <span className="tabular-nums">+ {formatNumber(vat)} ₫</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Tổng thanh toán</span>
                  <span className="tabular-nums text-accent">{formatNumber(total)} ₫</span>
                </div>
              </div>
            </Card>

            {/* Payment method */}
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                Phương thức thanh toán
              </p>
              <div className="flex items-center gap-3 p-3 rounded-md border border-accent/30 bg-accent/5">
                <CreditCard className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Chuyển khoản ngân hàng</p>
                  <p className="text-xs text-muted-foreground">VietcomBank · MB Bank · Techcombank</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-success/40 text-success">Được chọn</Badge>
              </div>
            </Card>

            {/* Trust note */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span>
                Giao dịch được bảo vệ bởi SmartDurian Escrow — tiền chỉ giải ngân cho carrier sau khi hàng đến đích an toàn.{" "}
                <a href="/dispute" className="underline hover:text-foreground">Cơ chế giải quyết tranh chấp →</a>
              </span>
            </div>

            {/* Pay button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý thanh toán...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Thanh toán {formatNumber(total)} ₫
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Bằng cách thanh toán, bạn đồng ý với{" "}
              <a href="/terms" className="underline hover:text-foreground">Điều khoản sử dụng</a>
              {" "}và{" "}
              <a href="/privacy" className="underline hover:text-foreground">Chính sách bảo mật</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
