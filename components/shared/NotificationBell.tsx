"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getNotifications, markNotificationRead } from "@/lib/data-store"
import type { Notification } from "@/lib/types"

interface NotificationBellProps {
  userId: string
}

const typeIcon: Record<string, string> = {
  phase_update: "📦",
  eta_change: "⏱",
  incident: "⚠️",
  booking_confirmed: "✅",
  rating_received: "⭐",
  consolidation_match: "🔗",
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setNotifications(getNotifications(userId))
  }, [userId])

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen)
    if (isOpen) {
      setNotifications(getNotifications(userId))
    }
  }

  function handleMarkRead(notifId: string) {
    markNotificationRead(notifId)
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    )
  }

  const recent = notifications.slice(0, 6)

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground font-normal">{unreadCount} chưa đọc</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recent.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            Không có thông báo mới
          </div>
        ) : (
          recent.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className={cn("flex flex-col items-start gap-0.5 px-3 py-2.5 cursor-pointer", !notif.read && "bg-accent/5")}
              onClick={() => handleMarkRead(notif.id)}
            >
              <div className="flex items-start gap-2 w-full">
                <span className="text-sm leading-none mt-0.5">{typeIcon[notif.type] ?? "🔔"}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-tight", !notif.read && "font-medium")}>{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                </div>
                {!notif.read && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
