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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
      "w-56 flex-shrink-0 border-r border-border bg-card flex flex-col h-screen sticky top-0 z-30",
      className
    )}>
      {/* Logo + tagline */}
      <div className="px-5 pt-5 pb-4 border-b border-border/60">
        <Logo
          size="md"
          href={role === "shipper" ? "/shipper/dashboard" : "/carrier/dashboard"}
        />
        <p className="text-[10px] text-muted-foreground/50 mt-2 tracking-wide leading-none font-medium">
          Smarter Logistics · Fresher Tomorrow
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">
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
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                isActive ? "text-accent" : "group-hover:text-foreground"
              )} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 text-accent/60 flex-shrink-0" />}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-border/60 space-y-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 ring-1 ring-border flex-shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-xs bg-accent/20 text-accent font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-tight">{user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.location ?? "SmartDurian"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-[9px] h-4 px-1.5 font-medium border-accent/30 text-accent bg-accent/5"
          >
            {role === "shipper" ? "Exporter" : "Carrier"}
          </Badge>

          <div className="flex items-center gap-1">
            <button
              onClick={() => { resetDemoData(); window.location.href = "/" }}
              className="text-[9px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
            >
              reset
            </button>
            <span className="text-muted-foreground/20">·</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-0.5 text-[9px] text-muted-foreground/40 hover:text-danger transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
