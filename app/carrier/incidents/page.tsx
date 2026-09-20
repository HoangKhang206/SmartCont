"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { getCurrentUser, getContainers, getIncidents } from "@/lib/data-store"
import { formatRelative } from "@/lib/utils"
import type { User, Incident } from "@/lib/types"

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  traffic_jam: "Tắc đường",
  vehicle_breakdown: "Xe bị hỏng",
  temperature_deviation: "Nhiệt độ lệch",
  border_delay: "Chậm trễ cửa khẩu",
  weather: "Thời tiết",
  other: "Khác",
}

export default function CarrierIncidentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const myContainerIds = new Set(
        getContainers().filter((c) => c.carrierId === u.id).map((c) => c.id)
      )
      const all = getIncidents()
        .filter((i) => myContainerIds.has(i.containerId))
        .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
      setIncidents(all)
    }
  }, [])

  if (!user) return null

  const open = incidents.filter((i) => !i.resolved)
  const resolved = incidents.filter((i) => i.resolved)

  return (
    <DashboardShell requiredRole="carrier">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Sự cố vận chuyển</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {open.length} đang mở · {resolved.length} đã xử lý
            </p>
          </div>
          <Button variant="destructive" asChild>
            <Link href="/carrier/incidents/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Báo sự cố
            </Link>
          </Button>
        </div>

        {incidents.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="Chưa có sự cố nào"
            description="Mọi chuyến hàng đang vận hành suôn sẻ."
            className="py-12"
          />
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <Card key={inc.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusBadge status={inc.severity} />
                      <Badge variant="outline" className="text-xs">{INCIDENT_TYPE_LABELS[inc.type] ?? inc.type}</Badge>
                      {inc.resolved && <Badge variant="secondary" className="text-xs text-success">Đã xử lý</Badge>}
                    </div>
                    <p className="font-medium text-sm">{inc.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{inc.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cont {inc.containerId} · {formatRelative(inc.reportedAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
