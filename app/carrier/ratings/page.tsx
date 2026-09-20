"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { RatingBreakdown } from "@/components/carrier/RatingBreakdown"
import { RatingCard } from "@/components/carrier/RatingCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { getCurrentUser, getRatingsByCarrierId } from "@/lib/data-store"
import type { User, Rating } from "@/lib/types"

export default function CarrierRatingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const r = getRatingsByCarrierId(u.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setRatings(r)
    }
  }, [])

  if (!user) return null

  return (
    <DashboardShell requiredRole="carrier">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Đánh giá từ exporter</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{ratings.length} đánh giá nhận được</p>
        </div>

        {ratings.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Chưa có đánh giá nào"
            description="Sau khi hoàn thành chuyến hàng, exporter có thể để lại đánh giá cho bạn."
            className="py-12"
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Breakdown summary */}
            <div className="lg:col-span-1">
              <Card className="p-5 sticky top-4">
                <p className="font-medium mb-4">Tổng quan</p>
                <RatingBreakdown user={user} />
              </Card>
            </div>

            {/* Individual ratings */}
            <div className="lg:col-span-2 space-y-3">
              {ratings.map((r) => (
                <RatingCard key={r.id} rating={r} showResponse />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
