"use client"

import { cn } from "@/lib/utils"

interface LiveIndicatorProps {
  label?: string
  className?: string
}

export function LiveIndicator({ label = "Live", className }: LiveIndicatorProps) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className="status-dot-live" />
      <span className="text-xs font-medium text-cold">{label}</span>
    </span>
  )
}
