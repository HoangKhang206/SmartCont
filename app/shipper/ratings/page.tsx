"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { EmptyState } from "@/components/shared/EmptyState"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { StarRating } from "@/components/shared/StarRating"
import { getCurrentUser, getBookings, getContainerById, getRatings } from "@/lib/data-store"
import { formatRelative } from "@/lib/utils"
import type { Booking, Rating } from "@/lib/types"

interface BookingWithMeta extends Booking {
  carrierName: string
  rating?: Rating
}

export default function ShipperRatingsPage() {
  const [pending, setPending] = useState<BookingWithMeta[]>([])
  const [done, setDone] = useState<BookingWithMeta[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return

    const allRatings = getRatings()
    const ratedIds = new Set(allRatings.map((r) => r.bookingId))

    const completed = getBookings().filter(
      (b) => b.shipperId === user.id && b.status === "completed"
    )

    const enriched: BookingWithMeta[] = completed.map((b) => {
      const container = getContainerById(b.containerId)
      const rating = allRatings.find((r) => r.bookingId === b.id)
      return { ...b, carrierName: container?.carrierName ?? b.containerId, rating }
    })

    setPending(enriched.filter((b) => !ratedIds.has(b.id)))
    setDone(enriched.filter((b) => ratedIds.has(b.id)))
  }, [])

  const total = pending.length + done.length

  return (
    <DashboardShell requiredRole="shipper">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Đánh giá carrier</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} chuyến đã hoàn thành</p>
        </div>

        {total === 0 && (
          <EmptyState
            icon={Star}
            title="Chưa có chuyến nào hoàn thành"
            description="Sau khi chuyến hàng được giao thành công, bạn có thể đánh giá carrier tại đây."
          />
        )}

        {/* Chờ đánh giá */}
        {pending.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <p className="text-sm font-medium">Chờ đánh giá ({pending.length})</p>
            </div>
            {pending.map((b) => (
              <Card key={b.id} className="p-4 border-warning/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-sm">{b.carrierName}</p>
                      <Badge variant="outline" className="text-[10px] border-warning/40 text-warning">
                        Chờ đánh giá
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.type === "fcl" ? "Nguyên cont (FCL)" : "Ghép cont (LCL)"} · {formatRelative(b.completedAt ?? b.bookedAt)}
                    </p>
                    <div className="mt-1">
                      <PriceDisplay amountVnd={b.totalPriceVnd} size="sm" />
                    </div>
                  </div>
                  <Button size="sm" asChild className="flex-shrink-0">
                    <Link href={`/shipper/ratings/new/${b.id}`}>
                      <Star className="h-3.5 w-3.5 mr-1.5" />
                      Đánh giá
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Đã đánh giá */}
        {done.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <p className="text-sm font-medium">Đã đánh giá ({done.length})</p>
            </div>
            {done.map((b) => (
              <Card key={b.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-sm">{b.carrierName}</p>
                      <Badge variant="outline" className="text-[10px] border-success/40 text-success">
                        Đã đánh giá
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.type === "fcl" ? "Nguyên cont (FCL)" : "Ghép cont (LCL)"} · {formatRelative(b.completedAt ?? b.bookedAt)}
                    </p>
                    {b.rating && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <StarRating value={b.rating.overallScore} readOnly size="sm" />
                        {b.rating.reviewText && (
                          <p className="text-xs text-muted-foreground line-clamp-1">"{b.rating.reviewText}"</p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" asChild className="flex-shrink-0">
                    <Link href={`/shipper/ratings/new/${b.id}`}>Xem lại</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
