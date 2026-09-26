"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, Map, Package, GitMerge, Star,
  Truck, CalendarCheck, AlertTriangle, MessageSquare, Container,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TopBar } from "@/components/shared/TopBar"
import { Sidebar } from "@/components/shared/Sidebar"
import { getCurrentUser } from "@/lib/data-store"
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator"
import type { User, UserRole } from "@/lib/types"

// ── Mobile bottom nav items ──────────────────────────────
const MOBILE_NAV: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
  shipper: [
    { label: "Home",   href: "/shipper/dashboard",     icon: LayoutDashboard },
    { label: "Map",    href: "/shipper/tracking",      icon: Map             },
    { label: "LOT",    href: "/shipper/shipments",     icon: Package         },
    { label: "Cont",   href: "/shipper/containers",    icon: Container       },
    { label: "Rating", href: "/shipper/ratings",       icon: Star            },
  ],
  carrier: [
    { label: "Home",    href: "/carrier/dashboard",  icon: LayoutDashboard },
    { label: "Fleet",   href: "/carrier/containers", icon: Truck           },
    { label: "Booking", href: "/carrier/bookings",   icon: CalendarCheck   },
    { label: "Sự cố",   href: "/carrier/incidents",  icon: AlertTriangle   },
    { label: "Rating",  href: "/carrier/ratings",    icon: MessageSquare   },
  ],
}

function MobileBottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const items = MOBILE_NAV[role]

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch h-16 border-t"
      style={{
        background: "hsl(var(--sidebar-bg))",
        borderColor: "hsl(var(--sidebar-border))",
      }}
    >
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2"
          >
            <Icon
              className="h-5 w-5 flex-shrink-0"
              style={{ color: isActive ? "#fff" : "hsl(var(--sidebar-muted))" }}
            />
            <span
              className="text-[10px] leading-none"
              style={{
                color: isActive ? "#fff" : "hsl(var(--sidebar-muted))",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

// ── Shell ────────────────────────────────────────────────
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
      {/* Sidebar — desktop only (hidden on mobile via Sidebar's own className) */}
      <Sidebar role={user.role} user={user} />

      {/* Right column: topbar + content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={user} />

        {noScroll ? (
          /* Desktop: no scroll, 1-viewport-fit. Mobile: always scrollable */
          <main className="flex-1 overflow-y-auto md:overflow-hidden bg-background">
            <div className={cn(
              "p-4 md:p-6 pb-20 md:pb-6",
              "md:h-full"
            )}>
              {children}
            </div>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-4 md:p-6 pb-20 md:pb-6">{children}</div>
          </main>
        )}
      </div>

      {/* Mobile bottom nav — fixed at bottom, hidden on md+ */}
      <MobileBottomNav role={user.role} />
    </div>
  )
}
