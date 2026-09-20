"use client"

import Link from "next/link"
import { CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { EmptyState } from "@/components/shared/EmptyState"
import { getBookings, getContainers, getUserById } from "@/lib/data-store"
import { formatRelative } from "@/lib/utils"
import type { User } from "@/lib/types"

interface IncomingBookingsProps {
  user: User
}

export function IncomingBookings({ user }: IncomingBookingsProps) {
  const myContainerIds = new Set(
    getContainers().filter((c) => c.carrierId === user.id).map((c) => c.id)
  )
  const bookings = getBookings()
    .filter((b) => myContainerIds.has(b.containerId))
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    .slice(0, 5)

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Chưa có booking nào"
        description="Khi exporter book cont của bạn, booking sẽ xuất hiện ở đây."
        className="py-8"
      />
    )
  }

  return (
    <div className="divide-y divide-border">
      {bookings.map((b) => {
        const shipper = getUserById(b.shipperId)
        return (
          <div key={b.id} className="py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium truncate">{shipper?.name ?? b.shipperId}</p>
                <StatusBadge status={b.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Cont {b.containerId} · {b.type === "consolidation" ? "Ghép cont" : "FCL"} · {formatRelative(b.bookedAt)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <PriceDisplay amountVnd={b.totalPriceVnd} size="sm" className="font-medium" />
              <Button variant="ghost" size="sm" className="h-7 text-xs mt-1" asChild>
                <Link href={`/carrier/bookings/${b.id}`}>Xem</Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
