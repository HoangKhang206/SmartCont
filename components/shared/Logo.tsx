import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "light"
  className?: string
}

const sizeMap = {
  sm: { img: "h-6 w-6",   text: "text-base", gap: "gap-1.5" },
  md: { img: "h-8 w-8",   text: "text-lg",   gap: "gap-2"   },
  lg: { img: "h-10 w-10", text: "text-xl",   gap: "gap-2.5" },
}

export function Logo({ href = "/", size = "md", variant = "default", className }: LogoProps) {
  const s = sizeMap[size]
  const isLight = variant === "light"

  const inner = (
    <span className={cn("flex items-center", s.gap, className)}>
      <img
        src="/logo.png"
        alt="SmartDurian"
        className={cn(s.img, "object-contain flex-shrink-0")}
      />
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
