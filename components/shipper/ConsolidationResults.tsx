"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ConsolidationCard } from "@/components/shipper/ConsolidationCard"
import { LoadingSteps, AI_CONSOLIDATION_STEPS } from "@/components/shared/LoadingSteps"
import { EmptyState } from "@/components/shared/EmptyState"
import { GitMerge } from "lucide-react"
import { saveBooking, saveShipment, getCarrierAutoConfirm } from "@/lib/data-store"
import { generateId } from "@/lib/utils"
import type { ConsolidationSuggestion, User } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ConsolidationResultsProps {
  suggestions: ConsolidationSuggestion[]
  isLoading: boolean
  loadingStep: string
  user: User
}

export function ConsolidationResults({ suggestions, isLoading, loadingStep, user }: ConsolidationResultsProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  if (isLoading) {
    return (
      <LoadingSteps
        steps={AI_CONSOLIDATION_STEPS}
        intervalMs={900}
        className="py-12"
      />
    )
  }

  if (suggestions.length === 0) {
    return (
      <EmptyState
        icon={GitMerge}
        title="Không tìm được cont phù hợp"
        description="Chưa có cont nào phù hợp với RSL và nhiệt độ của lô hàng này. Thử nới lỏng yêu cầu hoặc đợi thêm cont mới."
      />
    )
  }

  async function handleSelect(suggestion: ConsolidationSuggestion) {
    setConfirming(true)
    await new Promise((r) => setTimeout(r, 600))

    const autoConfirm = getCarrierAutoConfirm(suggestion.container.carrierId)
    const bookingId = generateId("booking")
    saveBooking({
      id: bookingId,
      type: "consolidation",
      shipperId: user.id,
      containerId: suggestion.containerId,
      shipmentIds: suggestion.matchedShipments.map((s) => s.id),
      totalPriceVnd: Math.round(suggestion.totalVolumeM3 * suggestion.container.pricePerCubicMeter),
      status: autoConfirm ? "confirmed" : "pending",
      bookedAt: new Date().toISOString(),
      ...(autoConfirm ? { confirmedAt: new Date().toISOString() } : {}),
    })

    if (autoConfirm) {
      suggestion.matchedShipments.forEach((s) => {
        if (s.shipperId === user.id) {
          saveShipment({ ...s, status: "matched", containerId: suggestion.containerId })
        }
      })
      toast.success("Ghép cont thành công!", {
        description: `Mã booking: ${bookingId}. Cont ${suggestion.containerId} đã xác nhận.`,
      })
      router.push(`/shipper/tracking/${encodeURIComponent(suggestion.containerId)}`)
    } else {
      toast.info("Đã gửi yêu cầu ghép cont!", {
        description: `Mã booking: ${bookingId} — Carrier đang xem xét, thường phản hồi trong 15 phút.`,
      })
      router.push(`/shipper/shipments`)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tìm được <span className="font-medium text-foreground">{suggestions.length}</span> gợi ý ghép cont phù hợp.
      </p>
      {suggestions.map((s, i) => (
        <ConsolidationCard
          key={s.containerId}
          suggestion={s}
          rank={i + 1}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}
