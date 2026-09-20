"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/shared/DashboardShell"
import { IncidentForm } from "@/components/carrier/IncidentForm"
import { getCurrentUser, getContainers } from "@/lib/data-store"
import type { User, Container } from "@/lib/types"

function NewIncidentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [selectedContainerId, setSelectedContainerId] = useState(
    searchParams.get("containerId") ?? ""
  )

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const myContainers = getContainers().filter((c) => c.carrierId === u.id)
      setContainers(myContainers)
      if (!selectedContainerId && myContainers.length > 0) {
        setSelectedContainerId(myContainers[0].id)
      }
    }
  }, [])

  if (!user) return null

  return (
    <div className="max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/carrier/incidents"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Báo cáo sự cố</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Exporter sẽ được thông báo ngay</p>
        </div>
      </div>

      <Card className="p-5 space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Container</p>
          <Select value={selectedContainerId} onValueChange={setSelectedContainerId}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn cont..." />
            </SelectTrigger>
            <SelectContent>
              {containers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="font-mono">{c.id}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedContainerId && (
          <IncidentForm
            containerId={selectedContainerId}
            reportedBy={user.id}
            onSuccess={() => router.push("/carrier/incidents")}
          />
        )}
      </Card>
    </div>
  )
}

export default function NewIncidentPage() {
  return (
    <DashboardShell requiredRole="carrier">
      <Suspense fallback={null}>
        <NewIncidentContent />
      </Suspense>
    </DashboardShell>
  )
}
