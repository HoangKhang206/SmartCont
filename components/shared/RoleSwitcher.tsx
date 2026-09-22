"use client"

import { useRouter } from "next/navigation"
import { Warehouse, Truck, ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

interface RoleSwitcherProps {
  currentRole: UserRole
  onSwitch?: (role: UserRole) => void
}

const roleConfig = {
  shipper: { label: "Exporter", sublabel: "Doanh nghiệp / Xuất khẩu", icon: Warehouse },
  carrier: { label: "Carrier", sublabel: "Vận tải / Cold chain", icon: Truck },
}

export function RoleSwitcher({ currentRole, onSwitch }: RoleSwitcherProps) {
  const router = useRouter()
  const current = roleConfig[currentRole]
  const CurrentIcon = current.icon

  function handleSwitch(role: UserRole) {
    if (role === currentRole) return
    onSwitch?.(role)
    router.push(`/select-user?role=${role}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-sm font-medium border-border/60"
        >
          <CurrentIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{current.label}</span>
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Chuyển vai trò</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(roleConfig) as [UserRole, typeof roleConfig.shipper][]).map(([role, config]) => {
          const Icon = config.icon
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSwitch(role)}
              className={cn("flex items-center gap-2.5 cursor-pointer", role === currentRole && "bg-accent/10")}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className={cn("text-sm", role === currentRole && "font-medium text-accent")}>{config.label}</p>
                <p className="text-xs text-muted-foreground">{config.sublabel}</p>
              </div>
              {role === currentRole && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
