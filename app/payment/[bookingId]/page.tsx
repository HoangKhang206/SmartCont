"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, CreditCard, Loader2, Receipt, Shield, Clock, ArrowRight } from "lucide-react"
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
} from "@/lib/data-store"
import { PRICING, CONTAINER_SPECS } from "@/lib/constants"
import { formatNumber } from "@/lib/utils"
import type { Booking, Container } from "@/lib/types"

const PLATFORM_COMMISSION_RATE = 0.025
const VAT_RATE = 0.10

interface Breakdown {
  freight: number
  clearance: number
  commission: number
  vat: number
  total: number
}

function calcFullBreakdown(freightVnd: number): Breakdown {
  const freight = freightVnd
  const clearance = PRICING.borderClearanceVnd
  const commission = Math.round(freight * PLATFORM_COMMISSION_RATE)
  const vat = Math.round((clearance + commission) * VAT_RATE)
  const total = freight + clearance + commission + vat
  return { freight, clearance, commission, vat, total }
}

interface DepositBreakdown {
  depositFreight: number   // freight × depositPercent%
  clearance: number
  commission: number
  vat: number
  stage1Total: number
  remainingFreight: number // freight × (1 - depositPercent%)
  stage2Total: number
  depositPercent: number
}

function calcDepositBreakdown(freightVnd: number, depositPercent: number): DepositBreakdown {
  const clearance = PRICING.borderClearanceVnd
  const commission = Math.round(freightVnd * PLATFORM_COMMISSION_RATE)
  const vat = Math.round((clearance + commission) * VAT_RATE)
  const depositFreight = Math.round(freightVnd * depositPercent / 100)
  const remainingFreight = freightVnd - depositFreight
  return {
    depositFreight,
    clearance,
    commission,
    vat,
    stage1Total: depositFreight + clearance + commission + vat,
    remainingFreight,
    stage2Total: remainingFreight,
    depositPercent,
  }
}

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [container, setContainer] = useState<Container | null>(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    const b = getBookings().find((x) => x.id === bookingId)
    if (!b) return
    setBooking(b)
    const c = getContainerById(b.containerId)
    if (c) setContainer(c)
  }, [bookingId])

  async function handlePay() {
    if (!booking || !container) return
    setPaying(true)
    await new Promise((r) => setTimeout(r, 2000))

    const now = new Date().toISOString()
    const mode = container.paymentMode ?? "full"
    const isDepositMode = mode === "deposit"

    // Stage 1 of deposit (deposit not yet paid) → pay deposit
    const isPayingDeposit = isDepositMode && !booking.depositPaidAt

    const updated: Booking = isPayingDeposit
      ? { ...booking, depositPaidAt: now, status: "confirmed", confirmedAt: booking.confirmedAt ?? now }
      : { ...booking, paidAt: now, status: "confirmed", confirmedAt: booking.confirmedAt ?? now }

    saveBooking(updated)

    if (!isPayingDeposit) {
      // Full payment or final payment → match shipments
      getShipments()
        .filter((s) => booking.shipmentIds.includes(s.id))
        .forEach((s) => saveShipment({ ...s, status: "matched", containerId: container.id }))
    }

    setBooking(updated)
    setPaying(false)

    if (isPayingDeposit) {
      toast.success("Đặt cọc thành công!", {
        description: "Booking đã xác nhận. Phần còn lại thanh toán khi hàng đến nơi.",
      })
    } else {
      toast.success("Thanh toán thành công!", {
        description: "Lô hàng đã được xác nhận. Carrier sẽ liên hệ trong 15 phút.",
      })
      setTimeout(() => {
        router.push(`/shipper/tracking/${encodeURIComponent(container.id)}`)
      }, 1800)
    }
  }

  if (!booking || !container) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const mode = container.paymentMode ?? "full"
  const isDepositMode = mode === "deposit"
  const depositPercent = container.depositPercent ?? 30
  const spec = CONTAINER_SPECS[container.type]

  // Determine current stage
  const isFullyPaid = !!booking.paidAt
  const isDepositPaid = !!booking.depositPaidAt
  // Stage 2: deposit paid but not fully paid
  const isStage2 = isDepositMode && isDepositPaid && !isFullyPaid
  // Stage 1: nothing paid yet (deposit mode)
  const isStage1 = isDepositMode && !isDepositPaid

  const full = calcFullBreakdown(booking.totalPriceVnd)
  const dep = isDepositMode ? calcDepositBreakdown(booking.totalPriceVnd, depositPercent) : null

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

        {/* Fully paid */}
        {isFullyPaid && (
          <Card className="p-8 text-center border-success/30 bg-success/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <p className="font-semibold text-lg mb-1">Thanh toán hoàn tất</p>
            <p className="text-sm text-muted-foreground mb-4">
              Booking <span className="font-mono">{booking.id}</span> đã được xác nhận đầy đủ.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/shipper/tracking/${encodeURIComponent(container.id)}`)}
            >
              Xem tracking
            </Button>
          </Card>
        )}

        {/* Deposit paid — waiting for final payment */}
        {isStage2 && !isFullyPaid && (
          <>
            <div className="rounded-md border border-success/30 bg-success/5 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-success">Đã đặt cọc {depositPercent}% thành công</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Thanh toán phần còn lại ({100 - depositPercent}%) khi container đến điểm giao.
                </p>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-accent" />
                Giai đoạn 2 — Thanh toán phần còn lại
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Mã booking: <span className="font-mono text-foreground">{booking.id}</span>
              </p>
            </div>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                Chi tiết thanh toán — Giai đoạn 2
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Cước còn lại ({100 - depositPercent}% × giá cước)
                  </span>
                  <span className="tabular-nums">{formatNumber(dep!.remainingFreight)} ₫</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Tổng thanh toán</span>
                  <span className="tabular-nums text-accent">{formatNumber(dep!.stage2Total)} ₫</span>
                </div>
              </div>
            </Card>

            <ContainerInfoCard container={container} booking={booking} spec={spec} />
            <TrustNote />
            <PayButton paying={paying} amount={dep!.stage2Total} onPay={handlePay} label="Thanh toán phần còn lại" />
            <LegalNote />
          </>
        )}

        {/* Stage 1 deposit or full payment */}
        {!isFullyPaid && !isStage2 && (
          <>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-accent" />
                {isStage1 ? `Giai đoạn 1 — Đặt cọc ${depositPercent}%` : "Xác nhận thanh toán"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Mã booking: <span className="font-mono text-foreground">{booking.id}</span>
              </p>
            </div>

            {/* Deposit mode: show 2-stage overview */}
            {isStage1 && dep && (
              <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lộ trình thanh toán 2 giai đoạn</p>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold flex-shrink-0">1</div>
                  <div className="flex-1">
                    <p className="font-medium">Đặt cọc {depositPercent}% — Ngay bây giờ</p>
                    <p className="text-xs text-muted-foreground">Bao gồm phí DV, hoa hồng, VAT</p>
                  </div>
                  <span className="tabular-nums font-medium text-accent">{formatNumber(dep.stage1Total)} ₫</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground text-xs font-semibold flex-shrink-0">2</div>
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Phần còn lại {100 - depositPercent}% — Khi hàng đến</p>
                    <p className="text-xs text-muted-foreground">Chỉ thanh toán sau khi container đến đích</p>
                  </div>
                  <span className="tabular-nums text-muted-foreground">{formatNumber(dep.stage2Total)} ₫</span>
                </div>
              </div>
            )}

            <ContainerInfoCard container={container} booking={booking} spec={spec} />

            {/* Price breakdown */}
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                {isStage1 ? `Chi tiết — Giai đoạn 1 (đặt cọc ${depositPercent}%)` : "Chi tiết thanh toán"}
              </p>
              <div className="space-y-2.5 text-sm">
                {isStage1 && dep ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Cước đặt cọc ({depositPercent}% × {formatNumber(booking.totalPriceVnd)} ₫)
                      </span>
                      <span className="tabular-nums">{formatNumber(dep.depositFreight)} ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí thông quan (ước tính)</span>
                      <span className="tabular-nums">{formatNumber(dep.clearance)} ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Hoa hồng nền tảng
                        <span className="ml-1 text-[10px] text-muted-foreground/60">({(PLATFORM_COMMISSION_RATE * 100).toFixed(1)}%)</span>
                      </span>
                      <span className="tabular-nums">{formatNumber(dep.commission)} ₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-muted-foreground">
                      <span>VAT 10% <span className="text-[10px] text-muted-foreground/60">(trên phí DV + hoa hồng)</span></span>
                      <span className="tabular-nums">+ {formatNumber(dep.vat)} ₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Thanh toán ngay (Giai đoạn 1)</span>
                      <span className="tabular-nums text-accent">{formatNumber(dep.stage1Total)} ₫</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Giai đoạn 2 (khi hàng đến)
                      </span>
                      <span className="tabular-nums">{formatNumber(dep.stage2Total)} ₫</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá cước cơ bản ({booking.type === "fcl" ? "FCL" : "LCL"})</span>
                      <span className="tabular-nums">{formatNumber(full.freight)} ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí thông quan (ước tính)</span>
                      <span className="tabular-nums">{formatNumber(full.clearance)} ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Hoa hồng nền tảng
                        <span className="ml-1 text-[10px] text-muted-foreground/60">({(PLATFORM_COMMISSION_RATE * 100).toFixed(1)}%)</span>
                      </span>
                      <span className="tabular-nums">{formatNumber(full.commission)} ₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        VAT (10%) <span className="text-[10px] text-muted-foreground/60">áp dụng trên phí DV + hoa hồng</span>
                      </span>
                      <span className="tabular-nums">+ {formatNumber(full.vat)} ₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Tổng thanh toán</span>
                      <span className="tabular-nums text-accent">{formatNumber(full.total)} ₫</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Payment method */}
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Phương thức</p>
              <div className="flex items-center gap-3 p-3 rounded-md border border-accent/30 bg-accent/5">
                <CreditCard className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Chuyển khoản ngân hàng</p>
                  <p className="text-xs text-muted-foreground">VietcomBank · MB Bank · Techcombank</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-success/40 text-success">Được chọn</Badge>
              </div>
            </Card>

            <TrustNote />

            <PayButton
              paying={paying}
              amount={isStage1 && dep ? dep.stage1Total : full.total}
              onPay={handlePay}
              label={isStage1 ? `Đặt cọc ${depositPercent}% ngay` : undefined}
            />
            <LegalNote />
          </>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ContainerInfoCard({ container, booking, spec }: {
  container: Container
  booking: Booking
  spec: { nameVi: string } | undefined
}) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Thông tin cont</p>
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
          <span className="text-muted-foreground">Booking</span>
          <span className="font-mono text-xs">{booking.id}</span>
        </div>
      </div>
    </Card>
  )
}

function TrustNote() {
  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground">
      <Shield className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
      <span>
        Giao dịch được bảo vệ bởi SmartDurian Escrow — tiền chỉ giải ngân cho carrier sau khi hàng đến đích an toàn.{" "}
        <a href="/dispute" className="underline hover:text-foreground">Cơ chế giải quyết tranh chấp →</a>
      </span>
    </div>
  )
}

function PayButton({ paying, amount, onPay, label }: {
  paying: boolean
  amount: number
  onPay: () => void
  label?: string
}) {
  return (
    <Button className="w-full" size="lg" onClick={onPay} disabled={paying}>
      {paying ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          {label ?? `Thanh toán ${formatNumber(amount)} ₫`}
          {!label && <span className="ml-1 text-sm opacity-80">({formatNumber(amount)} ₫)</span>}
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  )
}

function LegalNote() {
  return (
    <p className="text-center text-[11px] text-muted-foreground">
      Bằng cách thanh toán, bạn đồng ý với{" "}
      <a href="/terms" className="underline hover:text-foreground">Điều khoản sử dụng</a>
      {" "}và{" "}
      <a href="/privacy" className="underline hover:text-foreground">Chính sách bảo mật</a>
    </p>
  )
}
