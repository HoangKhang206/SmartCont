"use client"

import dynamic from "next/dynamic"
import { getContainers, getRouteById } from "@/lib/data-store"

const LeafletMap = dynamic(
  () => import("@/components/dashboard/NetworkMapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded-md">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-[10px] text-muted-foreground">Đang tải bản đồ...</p>
        </div>
      </div>
    ),
  }
)

export function ContainerNetworkMap() {
  const containers = getContainers()

  // Pool summary for legend
  const cityMap: Record<string, number> = {}
  containers.forEach((c) => {
    const route = getRouteById(c.routeId)
    const city = route?.originCity ?? "Khác"
    if (!cityMap[city]) cityMap[city] = 0
    if (!["in_transit", "at_border", "cleared_border"].includes(c.currentPhase)) {
      cityMap[city] += 1
    }
  })

  const topPools = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Map */}
      <div className="flex-1 min-h-[240px] rounded-lg overflow-hidden border border-border relative isolate">
        <LeafletMap />

        {/* Legend overlay */}
        <div className="absolute bottom-2 left-2 z-[1000] bg-card/90 backdrop-blur-sm border border-border rounded-md p-2.5 space-y-1.5">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Reefer Pools</p>
          {topPools.map(([city, count]) => (
            <div key={city} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: count >= 5 ? "#10b981" : count >= 1 ? "#f59e0b" : "#ef4444" }}
              />
              <span className="text-[10px] text-foreground/80 flex-1">{city}</span>
              <span className="text-[10px] font-semibold text-foreground tabular-nums">{count}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
            <span className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
            <span className="text-[10px] text-foreground/80">Cửa khẩu</span>
          </div>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Sẵn sàng (≥5)", color: "bg-success/15 text-success border-success/20", count: Object.values(cityMap).filter(v => v >= 5).length },
          { label: "Hạn chế (1–4)", color: "bg-warning/15 text-warning border-warning/20", count: Object.values(cityMap).filter(v => v >= 1 && v < 5).length },
          { label: "Thiếu cont (0)", color: "bg-danger/15 text-danger border-danger/20", count: Object.values(cityMap).filter(v => v === 0).length },
        ].map(({ label, color, count }) => (
          <div key={label} className={`flex flex-col items-center py-1.5 rounded-md border text-center ${color}`}>
            <span className="text-base font-semibold tabular-nums leading-none">{count}</span>
            <span className="text-[9px] mt-0.5 leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
