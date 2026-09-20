"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { ContainerCard } from "@/components/shipper/ContainerCard"
import { ContainerFilter, type ContainerFilterValues } from "@/components/shipper/ContainerFilter"
import { EmptyState } from "@/components/shared/EmptyState"
import { Container } from "lucide-react"
import { getContainers } from "@/lib/data-store"
import type { Container as ContainerType } from "@/lib/types"

function ContainersContent() {
  const params = useSearchParams()
  const shipmentId = params.get("shipmentId") ?? undefined
  const [all, setAll] = useState<ContainerType[]>([])
  const [filter, setFilter] = useState<ContainerFilterValues>({ routeId: "", type: "", availableForConsolidation: "", maxPrice: "" })

  useEffect(() => {
    setAll(getContainers().filter((c) => c.currentPhase === "booked"))
  }, [])

  const filtered = all.filter((c) => {
    if (filter.routeId && c.routeId !== filter.routeId) return false
    if (filter.type && c.type !== filter.type) return false
    if (filter.availableForConsolidation === "true" && !c.availableForConsolidation) return false
    if (filter.availableForConsolidation === "false" && c.availableForConsolidation) return false
    return true
  })

  return (
    <DashboardShell requiredRole="shipper">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tìm container</h1>
          <p className="text-sm text-muted-foreground mt-1">{all.length} cont đang sẵn sàng</p>
        </div>

        <ContainerFilter value={filter} onChange={setFilter} />

        {filtered.length === 0 ? (
          <EmptyState
            icon={Container}
            title="Không có cont phù hợp"
            description="Thử thay đổi filter hoặc chọn tuyến đường khác."
            action={{ label: "Xoá filter", onClick: () => setFilter({ routeId: "", type: "", availableForConsolidation: "", maxPrice: "" }) }}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => <ContainerCard key={c.id} container={c} shipmentId={shipmentId} />)}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default function ContainersPage() {
  return (
    <Suspense fallback={null}>
      <ContainersContent />
    </Suspense>
  )
}
