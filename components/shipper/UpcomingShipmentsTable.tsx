"use client"

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RslBadge } from "@/components/shipper/RslIndicator"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatDate } from "@/lib/utils"
import { PRODUCTS } from "@/lib/constants"
import { getShipments, getBookings } from "@/lib/data-store"
import { Package } from "lucide-react"
import type { User } from "@/lib/types"

interface UpcomingShipmentsTableProps {
  user: User
}

export function UpcomingShipmentsTable({ user }: UpcomingShipmentsTableProps) {
  const active = getShipments()
    .filter((s) => s.shipperId === user.id && !["delivered", "cancelled"].includes(s.status))
    .slice(0, 5)

  const bookings = getBookings()

  function getBookingType(shipmentId: string) {
    return bookings.find((b) => b.shipmentIds.includes(shipmentId))?.type
  }

  if (active.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Chưa có lô hàng nào"
        description="Tạo lô hàng mới để bắt đầu tìm cont hoặc ghép cont."
        action={{ label: "Tạo lô hàng", href: "/shipper/shipments/new" }}
        className="py-10"
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sản phẩm</TableHead>
          <TableHead>Tuyến</TableHead>
          <TableHead>RSL</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {active.map((s) => {
          const product = PRODUCTS[s.productType]
          const bookingType = s.status === "matched" ? getBookingType(s.id) : undefined
          return (
            <TableRow key={s.id}>
              <TableCell>
                <p className="font-medium text-sm">{product?.nameVi ?? s.productType}</p>
                <p className="text-xs text-muted-foreground">{(s.weightKg / 1000).toFixed(1)} tấn · {s.volumeM3} m³</p>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {s.originCity.split(",")[0]} → {s.destinationBorder}
              </TableCell>
              <TableCell><RslBadge rsl={s.rsl} /></TableCell>
              <TableCell className="text-sm tabular-nums">{formatDate(s.deadlineDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusBadge status={s.status} />
                  {bookingType && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-muted-foreground/30 text-muted-foreground">
                      {bookingType === "fcl" ? "FCL" : "LCL"}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/shipper/shipments/${s.id}`}>Chi tiết</Link>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
