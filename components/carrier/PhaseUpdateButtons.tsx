"use client"

import { useState } from "react"
import { CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { saveContainer, addNotification, getBookings } from "@/lib/data-store"
import { PHASE_LABELS } from "@/lib/constants"
import { PHASE_ORDER } from "@/lib/types"
import { generateId } from "@/lib/utils"
import type { ContainerPhase, Container } from "@/lib/types"

interface PhaseUpdateButtonsProps {
  container: Container
  carrierId: string
  onUpdated?: (updated: Container) => void
}

export function PhaseUpdateButtons({ container, carrierId, onUpdated }: PhaseUpdateButtonsProps) {
  const [loading, setLoading] = useState(false)
  const currentIdx = PHASE_ORDER.indexOf(container.currentPhase)
  const nextPhase: ContainerPhase | undefined = PHASE_ORDER[currentIdx + 1]
  const isFinished = container.currentPhase === "delivered"

  async function handleAdvance() {
    if (!nextPhase) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))

    const updated: Container = { ...container, currentPhase: nextPhase }
    saveContainer(updated)

    // Notify shipper (all bookings on this container)
    const bookings = getBookings().filter((b) => b.containerId === container.id)
    bookings.forEach((b) => {
      addNotification({
        id: generateId("notif"),
        userId: b.shipperId,
        type: "phase_update",
        title: "Cập nhật hành trình",
        message: `Cont ${container.id} chuyển sang giai đoạn: ${PHASE_LABELS[nextPhase]}`,
        containerId: container.id,
        read: false,
        createdAt: new Date().toISOString(),
      })
    })

    toast.success("Đã cập nhật giai đoạn!", {
      description: PHASE_LABELS[nextPhase],
    })
    setLoading(false)
    onUpdated?.(updated)
  }

  if (isFinished) {
    return (
      <div className="flex items-center gap-2 text-success text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" />
        Đã hoàn thành giao hàng
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Hiện tại:</span>
        <Badge variant="secondary">{PHASE_LABELS[container.currentPhase]}</Badge>
      </div>
      {nextPhase && (
        <Button size="sm" onClick={handleAdvance} disabled={loading} className="gap-1.5">
          {loading ? "Đang cập nhật..." : (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              {PHASE_LABELS[nextPhase]}
            </>
          )}
        </Button>
      )}
    </div>
  )
}
