"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Package, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { CarrierMetrics } from "@/components/carrier/CarrierMetrics"
import { IncomingBookings } from "@/components/carrier/IncomingBookings"
import { RatingBreakdown } from "@/components/carrier/RatingBreakdown"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { getCurrentUser, getContainers } from "@/lib/data-store"
import { PHASE_LABELS } from "@/lib/constants"
import { formatDateTime } from "@/lib/utils"
import type { User, Container } from "@/lib/types"

export default function CarrierDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [containers, setContainers] = useState<Container[]>([])

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const all = getContainers().filter((c) => c.carrierId === u.id)
      setContainers(all.slice(0, 4))
    }
  }, [])

  if (!user) return null

  return (
    <DashboardShell requiredRole="carrier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Xin chào, {user.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tổng quan hoạt động vận chuyển của bạn</p>
          </div>
          <Button asChild>
            <Link href="/carrier/containers/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Publish chuyến
            </Link>
          </Button>
        </div>

        {/* Metrics */}
        <CarrierMetrics user={user} />

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Incoming bookings */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Booking mới nhất
                </p>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/carrier/bookings" className="text-xs">Xem tất cả</Link>
                </Button>
              </div>
              <IncomingBookings user={user} />
            </Card>

            {/* Container list */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-accent" />
                  Container của bạn
                </p>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/carrier/containers" className="text-xs">Xem tất cả</Link>
                </Button>
              </div>
              {containers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Chưa có cont nào.{" "}
                  <Link href="/carrier/containers/new" className="text-primary underline">Publish chuyến đầu tiên</Link>
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {containers.map((c) => (
                    <Link
                      key={c.id}
                      href={`/carrier/containers/${encodeURIComponent(c.id)}`}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-muted/30 -mx-1 px-1 rounded transition-colors block"
                    >
                      <div>
                        <p className="font-mono text-sm font-medium">{c.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(c.departureDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground tabular-nums">{c.utilizationPercent.toFixed(1)}%</span>
                        <StatusBadge status={c.currentPhase} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Rating breakdown */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Đánh giá</p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/carrier/ratings" className="text-xs">Chi tiết</Link>
              </Button>
            </div>
            <RatingBreakdown user={user} />
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
