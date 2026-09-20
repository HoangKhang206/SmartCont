"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserCog } from "lucide-react"
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
import { Logo } from "@/components/shared/Logo"
import { RoleSwitcher } from "@/components/shared/RoleSwitcher"
import { NotificationBell } from "@/components/shared/NotificationBell"
import { ProfileEditDialog } from "@/components/shared/ProfileEditDialog"
import { logout, setCurrentUser } from "@/lib/data-store"
import type { User } from "@/lib/types"

interface TopBarProps {
  user: User
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

export function TopBar({ user: initialUser }: TopBarProps) {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [editOpen, setEditOpen] = useState(false)

  function handleLogout() {
    logout()
    router.push("/")
  }

  function handleRoleSwitch() {
    setCurrentUser(null)
    router.push("/select-user")
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-card px-4 gap-4">
      <Logo size="md" />

      <div className="flex-1" />

      <RoleSwitcher currentRole={user.role} onSwitch={handleRoleSwitch} />

      <NotificationBell userId={user.id} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 px-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium max-w-32 truncate">{user.name}</span>
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
