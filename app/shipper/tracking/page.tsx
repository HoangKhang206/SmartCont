"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Snowflake } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { LiveIndicator } from "@/components/shared/LiveIndicator"
import { EmptyState } from "@/components/shared/EmptyState"
import { getCurrentUser, getBookings, getContainerById } from "@/lib/data-store"
import { formatDateTime } from "@/lib/utils"
import { CONTAINER_SPECS } from "@/lib/constants"
import type { Container } from "@/lib/types"

export default function TrackingListPage() {
  const [containers, setContainers] = useState<Container[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return
    const bookings = getBookings().filter((b) => b.shipperId === user.id && b.status !== "cancelled")
    const seen = new Set<string>()
    const conts: Container[] = []
    bookings.forEach((b) => {
      if (!seen.has(b.containerId)) {
        const c = getContainerById(b.containerId)
        if (c) { conts.push(c); seen.add(b.containerId) }
      }
    })
    setContainers(conts)
  }, [])

  return (
    <DashboardShell requiredRole="shipper">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">{containers.length} container đang theo dõi</p>
        </div>

        {containers.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Chưa có container nào để track"
            description="Book cont hoặc ghép cont trước để theo dõi hành trình."
            action={{ label: "Tìm container", href: "/shipper/containers" }}
          />
        ) : (
          <div className="space-y-3">
            {containers.map((c) => {
              const spec = CONTAINER_SPECS[c.type]
              const isLive = c.currentPhase === "in_transit"
              return (
                <Card key={c.id} className="p-4 hover:border-accent/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isLive && <LiveIndicator />}
                      <div>
                        <p className="font-mono text-sm font-medium">{c.id}</p>
                        <p className="text-xs text-muted-foreground">{c.carrierName} · {spec?.nameVi}</p>
                      </div>
                    </div>
                    <StatusBadge status={c.currentPhase} />
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Snowflake className="h-3.5 w-3.5 text-cold" />
                      {c.temperatureSetpointC}°C
                    </span>
                    <span>Dự kiến: {formatDateTime(c.arrivalEstimateDate)}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/shipper/tracking/${encodeURIComponent(c.id)}`}>
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        Xem chi tiết
                      </Link>
                    </Button>
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
