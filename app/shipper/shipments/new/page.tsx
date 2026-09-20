"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { ShipmentForm, type ShipmentFormValues } from "@/components/shipper/ShipmentForm"
import { RslBadge } from "@/components/shipper/RslIndicator"
import { getCurrentUser, saveShipment } from "@/lib/data-store"
import { generateId } from "@/lib/utils"
import Link from "next/link"

export default function NewShipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rslPreview, setRslPreview] = useState<number | null>(null)

  async function handleSubmit(values: ShipmentFormValues, rsl: number) {
    setRslPreview(rsl)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const user = getCurrentUser()
    if (!user) return

    const id = generateId("shipment")
    saveShipment({
      id,
      shipperId: user.id,
      shipperName: user.name,
      productType: values.productType as never,
      weightKg: values.weightKg,
      volumeM3: values.volumeM3,
      harvestDate: values.harvestDate,
      daa: values.daa,
      maturityScore: values.maturityScore,
      temperatureRequiredC: values.temperatureRequiredC,
      originAddress: values.originAddress,
      originCity: values.originCity,
      destination: values.destination,
      destinationBorder: values.destinationBorder,
      deadlineDate: values.deadlineDate,
      status: "pending_match",
      rsl,
      createdAt: new Date().toISOString(),
    })

    toast.success("Đã tạo lô hàng!", {
      description: `RSL tự tính: ${rsl} ngày. Mã: ${id}`,
    })
    router.push(`/shipper/shipments/${id}`)
  }

  return (
    <DashboardShell requiredRole="shipper">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/shipper/shipments"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tạo lô hàng mới</h1>
            <p className="text-sm text-muted-foreground">Nhập thông tin lô hàng — hệ thống sẽ tự tính RSL</p>
          </div>
        </div>

        {rslPreview !== null && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">RSL tự tính:</p>
            <RslBadge rsl={rslPreview} />
            <p className="text-xs text-muted-foreground ml-auto">Tính theo mô hình Q₀/k(T) · ASLT kinetics</p>
          </div>
        )}

        <Card className="p-6">
          <ShipmentForm onSubmit={handleSubmit} loading={loading} />
        </Card>
      </div>
    </DashboardShell>
  )
}
