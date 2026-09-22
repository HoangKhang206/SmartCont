"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Container,
  GitMerge,
  Map,
  Star,
  Truck,
  CalendarCheck,
  AlertTriangle,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type React from "react"
import { logout, resetDemoData } from "@/lib/data-store"
import { Logo } from "@/components/shared/Logo"
import type { UserRole, User } from "@/lib/types"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const shipperNav: NavItem[] = [
  { label: "Dashboard",     href: "/shipper/dashboard",     icon: LayoutDashboard },
  { label: "LOT hàng",      href: "/shipper/shipments",     icon: Package },
  { label: "Tìm cont",      href: "/shipper/containers",    icon: Container },
  { label: "Ghép cont",     href: "/shipper/consolidation", icon: GitMerge },
  { label: "Live Tracking", href: "/shipper/tracking",      icon: Map },
  { label: "Đánh giá",      href: "/shipper/ratings",       icon: Star },
]

const carrierNav: NavItem[] = [
  { label: "Dashboard",    href: "/carrier/dashboard",  icon: LayoutDashboard },
  { label: "Container",    href: "/carrier/containers", icon: Truck },
  { label: "Bookings",     href: "/carrier/bookings",   icon: CalendarCheck },
  { label: "Sự cố",        href: "/carrier/incidents",  icon: AlertTriangle },
  { label: "Đánh giá",     href: "/carrier/ratings",    icon: MessageSquare },
]

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join("")
}

interface SidebarProps {
  role: UserRole
  user: User
  className?: string
}

export function Sidebar({ role, user, className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = role === "shipper" ? shipperNav : carrierNav

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <aside className={cn(
      "w-56 flex-shrink-0 flex flex-col h-screen sticky top-0 z-30 border-r",
      className
    )}
    style={{
      background: "hsl(var(--sidebar-bg))",
      borderColor: "hsl(var(--sidebar-border))",
    }}>
      {/* Logo + tagline */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid hsl(var(--sidebar-border))" }}>
        <Logo
          size="md"
          variant="light"
          href={role === "shipper" ? "/shipper/dashboard" : "/carrier/dashboard"}
        />
        <p className="text-[10px] mt-2 tracking-wide leading-none font-medium"
          style={{ color: "hsl(var(--sidebar-muted))" }}>
          Smarter Logistics · Fresher Tomorrow
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: "hsl(var(--sidebar-muted))" }}>
          {role === "shipper" ? "Exporter Portal" : "Carrier Portal"}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              )}
              style={{
                background: isActive ? "hsl(var(--sidebar-active))" : "transparent",
                color: isActive ? "hsl(var(--sidebar-fg))" : "hsl(var(--sidebar-muted))",
                fontWeight: isActive ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "hsl(var(--sidebar-hover))"
                  e.currentTarget.style.color = "hsl(var(--sidebar-fg))"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "hsl(var(--sidebar-muted))"
                }
              }}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 space-y-3"
        style={{ borderTop: "1px solid hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 flex-shrink-0 ring-1" style={{ "--tw-ring-color": "hsl(var(--sidebar-border))" } as React.CSSProperties}>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-xs font-semibold"
              style={{ background: "hsl(var(--sidebar-active))", color: "hsl(var(--sidebar-fg))" }}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight"
              style={{ color: "hsl(var(--sidebar-fg))" }}>
              {user.name}
            </p>
            <p className="text-[10px] truncate" style={{ color: "hsl(var(--sidebar-muted))" }}>
              {user.location ?? "SmartDurian"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm"
            style={{
              background: "hsl(var(--sidebar-active))",
              color: "hsl(152 80% 70%)",
            }}
          >
            {role === "shipper" ? "Exporter" : "Carrier"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetDemoData(); window.location.href = "/" }}
              className="text-[9px] transition-opacity opacity-30 hover:opacity-60"
              style={{ color: "hsl(var(--sidebar-muted))" }}
            >
              reset
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-0.5 transition-colors opacity-50 hover:opacity-90"
              style={{ color: "hsl(var(--sidebar-muted))" }}
              title="Đăng xuất"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
