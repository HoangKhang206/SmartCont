"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  className?: string
}

const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" }

export function StarRating({ value, onChange, max = 5, size = "md", readOnly = false, className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const iconSize = sizeMap[size]
  const display = hovered || value

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= display
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange?.(star)}
            className={cn("transition-transform", !readOnly && "hover:scale-110 cursor-pointer", readOnly && "cursor-default")}
          >
            <Star
              className={cn(
                iconSize,
                filled ? "fill-warning text-warning" : "text-muted-foreground/40",
                !readOnly && !filled && "hover:text-warning/60"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
