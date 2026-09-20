"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { PhaseTracker } from "@/components/shipper/PhaseTracker"
import { EtaCard } from "@/components/shipper/EtaCard"
import { TemperatureChart, generateFakeTemperatureData } from "@/components/shipper/TemperatureChart"
import { LiveIndicator } from "@/components/shared/LiveIndicator"
import { ErrorState } from "@/components/shared/ErrorState"
import { getContainerById, getRouteById } from "@/lib/data-store"
import { predictETA, updateETA } from "@/lib/fake-ai"
import { CONTAINER_SPECS } from "@/lib/constants"
import { formatDateTime } from "@/lib/utils"
import { usePhaseAutoAdvance } from "@/hooks/usePhaseAutoAdvance"
import type { Container, ETAPrediction, Route } from "@/lib/types"

const RouteMap = dynamic(() => import("@/components/map/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="h-80 rounded-lg border border-border bg-muted/50 animate-pulse flex items-center justify-center">
      <span className="text-xs text-muted-foreground">Đang tải bản đồ...</span>
    </div>
  ),
})

export default function TrackingDetailPage() {
  const { containerId } = useParams<{ containerId: string }>()
  const id = decodeURIComponent(containerId)
  const [container, setContainer] = useState<Container | null | undefined>(undefined)
  const [route, setRoute] = useState<Route | undefined>(undefined)
  const [eta, setEta] = useState<ETAPrediction | null>(null)
  const [tempData, setTempData] = useState<{ time: string; temp: number }[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const c = getContainerById(id)
    if (!c) { setContainer(null); return }
    setContainer(c)
    setTempData(generateFakeTemperatureData(c.temperatureSetpointC))

    const r = getRouteById(c.routeId)
    setRoute(r)
    const routeKey = c.routeId.replace("route_", "")
    const departure = new Date(c.departureDate)

    const initialEta = predictETA({
      routeKey,
      departureDate: departure,
      isPeakSeason: true,
      weatherCondition: "light_rain",
    })
    setEta(initialEta)

    if (c.currentPhase === "in_transit") {
      intervalRef.current = setInterval(() => {
        setEta((prev) => (prev ? updateETA(prev) : prev))
      }, 30000)
    }

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [id])

  usePhaseAutoAdvance(
    container ?? null,
    (updated) => setContainer(updated)
  )

  if (container === undefined) return null
  if (container === null) return <DashboardShell><ErrorState title="Không tìm thấy container" homeHref="/shipper/tracking" /></DashboardShell>

  const spec = CONTAINER_SPECS[container.type]
  const isLive = container.currentPhase === "in_transit"

  return (
    <DashboardShell requiredRole="shipper">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/shipper/tracking"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isLive && <LiveIndicator />}
              <p className="font-mono text-xl font-semibold">{container.id}</p>
            </div>
            <p className="text-sm text-muted-foreground">{container.carrierName} · {spec?.nameVi}</p>
          </div>
        </div>

        {/* Live map */}
        {route && (
          <RouteMap
            route={route}
            currentPhase={container.currentPhase}
            currentPosition={container.currentPosition}
            containerId={container.id}
            height="340px"
          />
        )}

        {/* Phase timeline */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-4">Trạng thái hành trình</p>
          <PhaseTracker currentPhase={container.currentPhase} />
        </Card>

        {/* ETA + Temperature */}
        <div className="grid md:grid-cols-2 gap-4">
          {eta && <EtaCard eta={eta} />}
          <TemperatureChart data={tempData} setpointC={container.temperatureSetpointC} />
        </div>

        {/* Container info */}
        <Card className="p-5">
          <p className="font-medium mb-3">Thông tin container</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-muted-foreground">Nhiệt độ set-point</p><p className="font-medium">{container.temperatureSetpointC}°C</p></div>
            <div><p className="text-xs text-muted-foreground">Utilization</p><p className="font-medium tabular-nums">{container.utilizationPercent}%</p></div>
            <div><p className="text-xs text-muted-foreground">Khởi hành</p><p className="font-medium">{formatDateTime(container.departureDate)}</p></div>
            <div><p className="text-xs text-muted-foreground">ETA baseline</p><p className="font-medium">{formatDateTime(container.arrivalEstimateDate)}</p></div>
          </div>
          {container.currentPosition && (
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              GPS: {container.currentPosition.lat.toFixed(4)}, {container.currentPosition.lng.toFixed(4)}
              {container.currentPosition.speedKmh && ` · ${container.currentPosition.speedKmh} km/h`}
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  )
}
