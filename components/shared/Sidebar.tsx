"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Container,
  GitMerge,
  MapPin,
  Star,
  Truck,
  CalendarCheck,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { resetDemoData } from "@/lib/data-store"
import type { UserRole } from "@/lib/types"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const shipperNav: NavItem[] = [
  { label: "Dashboard",   href: "/shipper/dashboard",      icon: LayoutDashboard },
  { label: "Lô hàng",     href: "/shipper/shipments",      icon: Package },
  { label: "Tìm cont",    href: "/shipper/containers",     icon: Container },
  { label: "Ghép cont",   href: "/shipper/consolidation",  icon: GitMerge },
  { label: "Tracking",    href: "/shipper/tracking",       icon: MapPin },
  { label: "Đánh giá",   href: "/shipper/ratings",        icon: Star },
]

const carrierNav: NavItem[] = [
  { label: "Dashboard",     href: "/carrier/dashboard",   icon: LayoutDashboard },
  { label: "Cont của tôi",  href: "/carrier/containers",  icon: Truck },
  { label: "Booking",       href: "/carrier/bookings",    icon: CalendarCheck },
  { label: "Sự cố",         href: "/carrier/incidents",   icon: AlertTriangle },
  { label: "Đánh giá",     href: "/carrier/ratings",     icon: MessageSquare },
]

interface SidebarProps {
  role: UserRole
  className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname()
  const navItems = role === "shipper" ? shipperNav : carrierNav

  return (
    <aside className={cn("w-64 flex-shrink-0 border-r border-border bg-card flex flex-col", className)}>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-accent" : "")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          {role === "shipper" ? "Exporter Portal" : "Carrier Portal"}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">SmartDurian v1.0</p>
        <button
          onClick={() => { resetDemoData(); window.location.href = "/" }}
          className="text-[9px] text-muted-foreground/40 hover:text-muted-foreground mt-1 transition-colors"
        >
          reset demo
        </button>
      </div>
    </aside>
  )
}
