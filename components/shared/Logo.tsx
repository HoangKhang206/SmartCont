import { Leaf } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "light"  // "light" for use on dark backgrounds (sidebar)
  className?: string
}

const sizeMap = {
  sm: { icon: "h-4 w-4", text: "text-base", gap: "gap-1.5", pad: "p-1" },
  md: { icon: "h-5 w-5", text: "text-lg",   gap: "gap-2",   pad: "p-1.5" },
  lg: { icon: "h-6 w-6", text: "text-xl",   gap: "gap-2.5", pad: "p-2" },
}

export function Logo({ href = "/", size = "md", variant = "default", className }: LogoProps) {
  const s = sizeMap[size]
  const isLight = variant === "light"

  const inner = (
    <span className={cn("flex items-center", s.gap, className)}>
      <span className={cn(
        "flex items-center justify-center rounded-md",
        s.pad,
        isLight ? "bg-white/15" : "bg-accent/10"
      )}>
        <Leaf
          className={cn(s.icon, isLight ? "text-green-300" : "text-accent")}
          strokeWidth={2}
        />
      </span>
      <span className={cn(
        "font-semibold tracking-tight",
        s.text,
        isLight ? "text-white" : "text-foreground"
      )}>
        Smart<span className={isLight ? "text-green-300" : "text-accent"}>Durian</span>
      </span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {inner}
      </Link>
    )
  }

  return inner
}
