"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { GitMerge } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { ConsolidationResults } from "@/components/shipper/ConsolidationResults"
import { RslBadge } from "@/components/shipper/RslIndicator"
import { getCurrentUser, getShipments, getContainers } from "@/lib/data-store"
import { suggestConsolidation } from "@/lib/fake-ai"
import { PRODUCTS } from "@/lib/constants"
import type { ConsolidationSuggestion, User, Shipment } from "@/lib/types"

function ConsolidationContent() {
  const params = useSearchParams()
  const preselectedId = params.get("shipmentId") ?? ""
  const [user, setUser] = useState<User | null>(null)
  const [myShipments, setMyShipments] = useState<Shipment[]>([])
  const [selectedId, setSelectedId] = useState(preselectedId)
  const [results, setResults] = useState<ConsolidationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const pending = getShipments().filter((s) => s.shipperId === u.id && s.status === "pending_match")
      setMyShipments(pending)
      if (preselectedId) setSelectedId(preselectedId)
    }
  }, [preselectedId])

  const selectedShipment = myShipments.find((s) => s.id === selectedId)

  async function handleSearch() {
    if (!selectedShipment) return
    setIsLoading(true)
    setHasSearched(true)
    setResults([])

    const allShipments = getShipments().filter((s) => s.status === "pending_match")
    const containers = getContainers().filter((c) => c.availableForConsolidation && c.currentPhase === "booked")

    const suggestions = await suggestConsolidation(
      selectedShipment,
      allShipments,
      containers,
      (step) => setLoadingStep(step)
    )

    setResults(suggestions)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ghép cont</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI tìm container phù hợp RSL và nhiệt độ, tối ưu utilization
        </p>
      </div>

      {/* Select shipment */}
      <Card className="p-5">
        <p className="font-medium mb-4">Chọn lô hàng cần ghép cont</p>
        {myShipments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Không có lô hàng nào đang chờ ghép cont. Tạo lô hàng mới trước.
          </p>
        ) : (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Lô hàng</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lô hàng..." />
                </SelectTrigger>
                <SelectContent>
                  {myShipments.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {PRODUCTS[s.productType]?.nameVi} — {s.weightKg / 1000}T — {s.destinationBorder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedShipment && <RslBadge rsl={selectedShipment.rsl} />}
            <Button onClick={handleSearch} disabled={!selectedId || isLoading}>
              <GitMerge className="h-4 w-4 mr-2" />
              {isLoading ? "Đang tìm..." : "Tìm ghép cont"}
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      {(hasSearched || isLoading) && user && (
        <ConsolidationResults
          suggestions={results}
          isLoading={isLoading}
          loadingStep={loadingStep}
          user={user}
        />
      )}
    </div>
  )
}

export default function ConsolidationPage() {
  return (
    <DashboardShell requiredRole="shipper">
      <Suspense fallback={<div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mt-20" />}>
        <ConsolidationContent />
      </Suspense>
    </DashboardShell>
  )
}
