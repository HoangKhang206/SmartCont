"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Sun, Cloud, LogOut, UserCog, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleSwitcher } from "@/components/shared/RoleSwitcher"
import { NotificationBell } from "@/components/shared/NotificationBell"
import { ProfileEditDialog } from "@/components/shared/ProfileEditDialog"
import { logout, setCurrentUser } from "@/lib/data-store"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { User } from "@/lib/types"

interface TopBarProps {
  user: User
}

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join("")
}

function getWeatherTemp(location?: string): number {
  const temps: Record<string, number> = {
    "Đắk Lắk": 28, "Tiền Giang": 31, "Lâm Đồng": 22,
    "Bình Thuận": 32, "Long An": 30, "Đồng Nai": 29,
  }
  if (!location) return 28
  for (const [city, temp] of Object.entries(temps)) {
    if (location.includes(city)) return temp
  }
  return 28
}

export function TopBar({ user: initialUser }: TopBarProps) {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [editOpen, setEditOpen] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  function handleLogout() {
    logout()
    router.push("/")
  }

  function handleRoleSwitch() {
    setCurrentUser(null)
    router.push("/select-user")
  }

  const temp = getWeatherTemp(user.location)
  const dateStr = format(now, "EEE, d MMM · HH:mm", { locale: vi })

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border/60 bg-card/80 backdrop-blur-md px-5 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Tìm LOT, container, FWD, địa điểm..."
          className="w-full h-8 pl-8 pr-3 text-xs bg-muted/40 border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all"
          readOnly
        />
      </div>

      <div className="flex-1" />

      {/* Date + weather */}
      <div className="hidden lg:flex items-center gap-2.5 text-xs text-muted-foreground bg-muted/30 border border-border/40 rounded-md px-3 h-8">
        <Sun className="h-3.5 w-3.5 text-warning flex-shrink-0" />
        <span className="text-foreground font-medium tabular-nums">{temp}°C</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="tabular-nums">{dateStr}</span>
        {user.location && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-muted-foreground/70 max-w-24 truncate">{user.location}</span>
          </>
        )}
      </div>

      {/* Notification bell */}
      <NotificationBell userId={user.id} />

      {/* Role switcher */}
      <RoleSwitcher currentRole={user.role} onSwitch={handleRoleSwitch} />

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 gap-2 px-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-[10px] bg-accent/20 text-accent font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium max-w-28 truncate">{user.name}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="font-medium text-sm">{user.name}</p>
            {user.location && <p className="text-xs text-muted-foreground font-normal">{user.location}</p>}
            {user.phone && <p className="text-xs text-muted-foreground font-normal">{user.phone}</p>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
            <UserCog className="h-4 w-4 mr-2" />
            Chỉnh sửa hồ sơ
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-danger focus:text-danger cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileEditDialog
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={(updated) => setUser(updated)}
      />
    </header>
  )
}
