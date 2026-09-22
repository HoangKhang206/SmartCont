"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/shared/TopBar"
import { Sidebar } from "@/components/shared/Sidebar"
import { getCurrentUser } from "@/lib/data-store"
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator"
import type { User } from "@/lib/types"

interface DashboardShellProps {
  children: React.ReactNode
  requiredRole?: "shipper" | "carrier"
  noScroll?: boolean
}

export function DashboardShell({ children, requiredRole, noScroll = false }: DashboardShellProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const current = getCurrentUser()
    if (!current) {
      router.replace("/")
      return
    }
    if (requiredRole && current.role !== requiredRole) {
      router.replace(`/${current.role}/dashboard`)
      return
    }
    setUser(current)
    setChecked(true)
  }, [router, requiredRole])

  useNotificationSimulator(user)

  if (!checked || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Đang tải SmartDurian...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left sidebar — full height, sticky */}
      <Sidebar role={user.role} user={user} />

      {/* Right column: topbar + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={user} />
        {noScroll ? (
          <main className="flex-1 overflow-hidden bg-background">
            <div className="h-full p-6">{children}</div>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-6">{children}</div>
          </main>
        )}
      </div>
    </div>
  )
}
