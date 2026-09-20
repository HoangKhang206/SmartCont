"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { saveContainer } from "@/lib/data-store"
import { PHASE_LABELS, ROUTE_BASE_HOURS } from "@/lib/constants"
import { PHASE_ORDER } from "@/lib/types"
import type { Container, ContainerPhase } from "@/lib/types"

// Map elapsed fraction of journey → expected phase
function computeExpectedPhase(elapsedFraction: number): ContainerPhase {
  if (elapsedFraction <= 0)   return "booked"
  if (elapsedFraction < 0.06) return "en_route_to_warehouse"
  if (elapsedFraction < 0.10) return "at_warehouse"
  if (elapsedFraction < 0.13) return "loading"
  if (elapsedFraction < 0.88) return "in_transit"
  if (elapsedFraction < 0.91) return "at_border"
  if (elapsedFraction < 0.94) return "customs_clearance"
  if (elapsedFraction < 0.97) return "cleared_border"
  if (elapsedFraction < 1.02) return "at_destination"
  return "delivered"
}

export function usePhaseAutoAdvance(
  container: Container | null | undefined,
  onAdvanced: (updated: Container) => void
) {
  useEffect(() => {
    if (!container) return
    if (container.currentPhase === "delivered") return

    const routeKey = container.routeId.replace("route_", "")
    const baseHours = ROUTE_BASE_HOURS[routeKey] ?? 34
    const departure = new Date(container.departureDate)
    const now = new Date()
    const elapsedHours = (now.getTime() - departure.getTime()) / (1000 * 60 * 60)
    const fraction = Math.max(0, elapsedHours / baseHours)

    const expectedPhase = computeExpectedPhase(fraction)
    const currentIdx = PHASE_ORDER.indexOf(container.currentPhase)
    const expectedIdx = PHASE_ORDER.indexOf(expectedPhase)

    if (expectedIdx > currentIdx) {
      const updated: Container = { ...container, currentPhase: expectedPhase }
      saveContainer(updated)
      onAdvanced(updated)
      toast.info("Cập nhật hành trình", {
        description: `Cont ${container.id}: ${PHASE_LABELS[expectedPhase]}`,
        duration: 4000,
      })
    }

    // Periodic advance every 45s for demo realism
    const interval = setInterval(() => {
      const idx = PHASE_ORDER.indexOf(expectedPhase)
      const next: ContainerPhase | undefined = PHASE_ORDER[idx + 1]
      if (!next) { clearInterval(interval); return }

      const advanced: Container = { ...container, currentPhase: next }
      saveContainer(advanced)
      onAdvanced(advanced)
      toast.info("Cập nhật hành trình", {
        description: `${PHASE_LABELS[next]}`,
        duration: 4000,
      })
    }, 45_000)

    return () => clearInterval(interval)
  }, [container?.id])
}
