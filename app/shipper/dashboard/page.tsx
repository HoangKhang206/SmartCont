"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, GitMerge, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { ShipperMetrics } from "@/components/shipper/ShipperMetrics"
import { UpcomingShipmentsTable } from "@/components/shipper/UpcomingShipmentsTable"
import { RecentActivityFeed } from "@/components/shipper/RecentActivityFeed"
import { getCurrentUser, getBookings, getRatings } from "@/lib/data-store"
import type { User, Booking } from "@/lib/types"

export default function ShipperDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [pendingRatings, setPendingRatings] = useState<Booking[]>([])

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const ratedBookingIds = new Set(getRatings().map((r) => r.bookingId))
      const pending = getBookings().filter(
        (b) => b.shipperId === u.id && b.status === "completed" && !ratedBookingIds.has(b.id)
      )
      setPendingRatings(pending)
    }
  }, [])

  return (
    <DashboardShell requiredRole="shipper">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user ? `Xin chào, ${user.name.split(" ").pop()}` : "Tổng quan lô hàng và hoạt động"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/shipper/consolidation">
                <GitMerge className="h-4 w-4 mr-1.5" />
                Ghép cont
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/shipper/shipments/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Tạo lô hàng
              </Link>
            </Button>
          </div>
        </div>

        {user && <ShipperMetrics user={user} />}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <p className="font-medium">Lô hàng đang hoạt động</p>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/shipper/shipments">Xem tất cả</Link>
                </Button>
              </div>
              {user && <UpcomingShipmentsTable user={user} />}
            </Card>
          </div>

          <div className="space-y-4">
            {/* Pending ratings card */}
            {pendingRatings.length > 0 && (
              <Card className="p-5 border-warning/40 bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <p className="font-medium text-sm">Có {pendingRatings.length} chuyến chờ đánh giá</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Đánh giá giúp cộng đồng chọn carrier uy tín hơn.
                </p>
                <Button size="sm" variant="outline" className="w-full border-warning/40 text-warning hover:bg-warning/10" asChild>
                  <Link href={`/shipper/ratings/new/${pendingRatings[0].id}`}>
                    Đánh giá ngay
                  </Link>
                </Button>
              </Card>
            )}

            <Card className="p-5">
              <p className="font-medium mb-4">Hoạt động gần đây</p>
              {user && <RecentActivityFeed user={user} />}
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-accent" />
                <p className="font-medium">Tracking nhanh</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Xem tất cả cont đang vận chuyển</p>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/shipper/tracking">Mở bản đồ tracking</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
