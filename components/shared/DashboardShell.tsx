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
}

export function DashboardShell({ children, requiredRole }: DashboardShellProps) {
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
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} className="hidden md:flex sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
