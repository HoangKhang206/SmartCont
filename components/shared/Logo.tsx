import { Snowflake } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: { icon: "h-4 w-4", text: "text-base", gap: "gap-1.5" },
  md: { icon: "h-5 w-5", text: "text-lg", gap: "gap-2" },
  lg: { icon: "h-6 w-6", text: "text-xl", gap: "gap-2.5" },
}

export function Logo({ href = "/", size = "md", className }: LogoProps) {
  const s = sizeMap[size]

  const inner = (
    <span className={cn("flex items-center", s.gap, className)}>
      <span className="flex items-center justify-center rounded-md bg-accent p-1">
        <Snowflake className={cn(s.icon, "text-accent-foreground")} strokeWidth={2.5} />
      </span>
      <span className={cn("font-semibold tracking-tight text-foreground", s.text)}>
        Smart<span className="text-accent">Durian</span>
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
