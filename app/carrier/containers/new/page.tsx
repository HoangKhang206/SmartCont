"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { ContainerForm } from "@/components/carrier/ContainerForm"
import { toast } from "sonner"
import { getCurrentUser, saveContainer } from "@/lib/data-store"
import { CONTAINER_SPECS } from "@/lib/constants"
import { generateId } from "@/lib/utils"
import type { User } from "@/lib/types"
import type { ContainerFormValues } from "@/components/carrier/ContainerForm"

export default function NewContainerPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  if (!user) return null

  async function handleSubmit(values: ContainerFormValues) {
    if (!user) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))

    const spec = CONTAINER_SPECS[values.type as keyof typeof CONTAINER_SPECS]
    const depDate = new Date(values.departureDate)
    const arrivalDate = new Date(depDate.getTime() + 34 * 60 * 60 * 1000) // 34h baseline

    saveContainer({
      id: values.id,
      carrierId: user.id,
      carrierName: user.name,
      type: values.type as "reefer_20ft" | "reefer_40ft" | "reefer_40hc",
      capacityKg: spec?.capacityKg ?? 29000,
      capacityM3: spec?.capacityM3 ?? 67,
      temperatureSetpointC: values.temperatureSetpointC,
      routeId: values.routeId,
      departureDate: depDate.toISOString(),
      arrivalEstimateDate: arrivalDate.toISOString(),
      pricePerCubicMeter: values.pricePerCubicMeter,
      priceForFullContainer: values.priceForFullContainer,
      availableForConsolidation: values.availableForConsolidation === "true",
      currentPhase: "booked",
      assignedShipmentIds: [],
      utilizationPercent: 0,
      createdAt: new Date().toISOString(),
    })

    toast.success("Đã publish chuyến thành công!", {
      description: `Cont ${values.id} đã hiển thị cho shipper.`,
    })
    router.push("/carrier/containers")
  }

  return (
    <DashboardShell requiredRole="carrier">
      <div className="max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/carrier/containers"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Publish chuyến mới</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Điền thông tin container để exporter có thể tìm và book</p>
          </div>
        </div>

        <Card className="p-5">
          <ContainerForm onSubmit={handleSubmit} loading={loading} />
        </Card>
      </div>
    </DashboardShell>
  )
}
