"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/data-store"
import type { Notification } from "@/lib/types"

interface NotificationBellProps {
  userId: string
}

const typeIcon: Record<string, string> = {
  phase_update:        "📦",
  eta_change:          "⏱️",
  incident:            "⚠️",
  booking_confirmed:   "✅",
  rating_received:     "⭐",
  consolidation_match: "🔗",
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return "vừa xong"
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  return `${Math.floor(hrs / 24)} ngày trước`
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const prevUnreadRef = useRef(0)

  function refresh() {
    setNotifications(getNotifications(userId))
  }

  // Poll every 3 seconds so bell badge updates when simulator adds a notification
  useEffect(() => {
    refresh()
    const interval = setInterval(() => {
      const fresh = getNotifications(userId)
      const newUnread = fresh.filter((n) => !n.read).length
      // If unread count jumped while bell is closed, animate the badge
      if (!open && newUnread > prevUnreadRef.current) {
        prevUnreadRef.current = newUnread
      }
      setNotifications(fresh)
    }, 3000)
    return () => clearInterval(interval)
  }, [userId, open])

  const unreadCount = notifications.filter((n) => !n.read).length
  const recent = notifications.slice(0, 8)

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen)
    if (isOpen) refresh()
  }

  function handleMarkRead(notifId: string) {
    markNotificationRead(notifId)
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)))
  }

  function handleMarkAll() {
    markAllNotificationsRead(userId)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className={cn("h-4 w-4 transition-transform", unreadCount > 0 && "animate-[wiggle_0.5s_ease-in-out]")} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground animate-in zoom-in-50 duration-200">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">Thông báo</span>
            {unreadCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={handleMarkAll}
            >
              <CheckCheck className="h-3 w-3" />
              Đọc tất cả
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[420px] overflow-y-auto">
          {recent.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Không có thông báo mới</p>
            </div>
          ) : (
            recent.map((notif, idx) => (
              <button
                key={notif.id}
                className={cn(
                  "w-full text-left flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50 border-b border-border/50 last:border-0",
                  !notif.read && "bg-accent/5"
                )}
                onClick={() => handleMarkRead(notif.id)}
              >
                {/* Icon */}
                <span className="text-base leading-none mt-0.5 flex-shrink-0">
                  {typeIcon[notif.type] ?? "🔔"}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-snug", !notif.read ? "font-medium text-foreground" : "text-foreground/80")}>
                    {/* Strip emoji from title since we show it separately */}
                    {notif.title.replace(/^[\p{Emoji}\s]+/u, "").trim()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {notifications.length > 8 && (
          <div className="px-4 py-2.5 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              {notifications.length - 8} thông báo khác đã được lưu trữ
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
