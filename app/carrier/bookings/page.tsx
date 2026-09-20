"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarClock, Zap, ClipboardCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { EmptyState } from "@/components/shared/EmptyState"
import { getCurrentUser, getContainers, getBookings, getUserById, getCarrierAutoConfirm, setCarrierAutoConfirm } from "@/lib/data-store"
import { formatRelative } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { User, Booking } from "@/lib/types"

export default function CarrierBookingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [autoConfirm, setAutoConfirmState] = useState(true)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      setAutoConfirmState(getCarrierAutoConfirm(u.id))
      const myContainerIds = new Set(
        getContainers().filter((c) => c.carrierId === u.id).map((c) => c.id)
      )
      const all = getBookings()
        .filter((b) => myContainerIds.has(b.containerId))
        .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
      setBookings(all)
    }
  }, [])

  function handleToggleMode(checked: boolean) {
    if (!user) return
    setCarrierAutoConfirm(user.id, checked)
    setAutoConfirmState(checked)
  }

  const filtered = bookings.filter((b) => statusFilter === "all" || b.status === statusFilter)
  const pendingCount = bookings.filter((b) => b.status === "pending").length

  if (!user) return null

  return (
    <DashboardShell requiredRole="carrier">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Booking nhận được</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{bookings.length} booking tổng cộng</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="in_progress">Đang vận chuyển</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Confirmation mode toggle */}
        <Card className={cn(
          "p-4 flex items-center justify-between gap-4 border",
          autoConfirm ? "border-success/30 bg-success/5" : "border-accent/30 bg-accent/5"
        )}>
          <div className="flex items-center gap-3">
            {autoConfirm
              ? <Zap className="h-5 w-5 text-success flex-shrink-0" />
              : <ClipboardCheck className="h-5 w-5 text-accent flex-shrink-0" />
            }
            <div>
              <p className="text-sm font-medium">
                {autoConfirm ? "Chế độ: Tự động xác nhận" : "Chế độ: Xác nhận thủ công"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {autoConfirm
                  ? "Booking mới từ exporter được xác nhận ngay lập tức."
                  : "Booking mới sẽ chờ bạn xem xét trước khi xác nhận."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {autoConfirm ? "Tự động" : "Thủ công"}
            </span>
            <Switch
              checked={autoConfirm}
              onCheckedChange={handleToggleMode}
            />
          </div>
        </Card>

        {/* Pending alert */}
        {pendingCount > 0 && !autoConfirm && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-warning/10 border border-warning/30">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning text-warning-foreground text-xs font-bold flex-shrink-0">
              {pendingCount}
            </span>
            <p className="text-sm text-warning-foreground font-medium">
              {pendingCount} booking đang chờ xác nhận — nhấn "Xem chi tiết" để xem xét.
            </p>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Không có booking"
            description="Chưa có booking nào phù hợp với bộ lọc này."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => {
              const shipper = getUserById(b.shipperId)
              const isPending = b.status === "pending"
              return (
                <Card key={b.id} className={cn("p-4", isPending && "border-warning/40")}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm truncate">{shipper?.name ?? b.shipperId}</p>
                        <StatusBadge status={b.status} />
                        {isPending && (
                          <span className="text-[10px] font-semibold text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                            CẦN XÁC NHẬN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Cont {b.containerId} · {b.type === "consolidation" ? "Ghép cont (LCL)" : "Nguyên cont (FCL)"} · {formatRelative(b.bookedAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <PriceDisplay amountVnd={b.totalPriceVnd} size="sm" className="font-medium" />
                      <Button
                        variant={isPending ? "default" : "ghost"}
                        size="sm"
                        className="h-7 text-xs mt-1"
                        asChild
                      >
                        <Link href={`/carrier/bookings/${b.id}`}>
                          {isPending ? "Xem xét" : "Xem chi tiết"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
