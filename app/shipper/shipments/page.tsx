"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { ShipmentCard } from "@/components/shipper/ShipmentCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Package } from "lucide-react"
import { getCurrentUser, getShipments, getBookings } from "@/lib/data-store"
import type { User, Shipment } from "@/lib/types"

export default function ShipmentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])

  const [pendingBookingMap, setPendingBookingMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      setShipments(
        getShipments()
          .filter((s) => s.shipperId === u.id)
          .sort((a, b) => a.rsl - b.rsl)
      )
      const map = new Map<string, string>()
      getBookings()
        .filter((b) => b.status === "pending")
        .forEach((b) => b.shipmentIds.forEach((sid) => map.set(sid, b.id)))
      setPendingBookingMap(map)
    }
  }, [])

  return (
    <DashboardShell requiredRole="shipper">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Lô hàng của tôi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {shipments.length} lô hàng · sắp xếp theo RSL ưu tiên &nbsp;
              <span title="RSL ≤ 7 ngày">🔴</span>
              <span title="RSL 7–14 ngày"> 🟡</span>
              <span title="RSL > 14 ngày"> 🟢</span>
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href="/shipper/shipments/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Tạo lô mới
            </Link>
          </Button>
        </div>

        {shipments.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Chưa có lô hàng nào"
            description="Tạo lô hàng mới để bắt đầu tìm cont hoặc ghép cont xuất khẩu."
            action={{ label: "Tạo lô hàng đầu tiên", href: "/shipper/shipments/new" }}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {shipments.map((s) => (
              <ShipmentCard key={s.id} shipment={s} pendingBookingId={pendingBookingMap.get(s.id)} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
