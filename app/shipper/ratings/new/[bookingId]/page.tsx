"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { RatingForm } from "@/components/shipper/RatingForm"
import { ErrorState } from "@/components/shared/ErrorState"
import { getBookings, getContainerById, getCurrentUser } from "@/lib/data-store"
import type { Booking, User } from "@/lib/types"

export default function NewRatingPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined)
  const [carrierId, setCarrierId] = useState("")
  const [carrierName, setCarrierName] = useState("")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    const b = getBookings().find((x) => x.id === bookingId)
    if (!b) { setBooking(null); return }
    setBooking(b)
    const c = getContainerById(b.containerId)
    if (c) { setCarrierId(c.carrierId); setCarrierName(c.carrierName) }
  }, [bookingId])

  if (booking === undefined || !user) return null
  if (!booking) return <DashboardShell><ErrorState title="Không tìm thấy booking" homeHref="/shipper/dashboard" /></DashboardShell>

  return (
    <DashboardShell requiredRole="shipper">
      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/shipper/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Đánh giá carrier</h1>
            <p className="text-sm text-muted-foreground">{carrierName} · Booking {bookingId}</p>
          </div>
        </div>

        <RatingForm booking={booking} carrierId={carrierId} carrierName={carrierName} user={user} />
      </div>
    </DashboardShell>
  )
}
