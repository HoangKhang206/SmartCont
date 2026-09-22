"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getShipments } from "@/lib/data-store"
import type { User } from "@/lib/types"

interface RslDonutChartProps {
  user: User
}

const COLORS = {
  safe:     { fill: "hsl(160 84% 39%)",  label: "text-success",  bg: "bg-success/10",  border: "border-success/20" },
  warning:  { fill: "hsl(38 92% 50%)",   label: "text-warning",  bg: "bg-warning/10",  border: "border-warning/20" },
  critical: { fill: "hsl(351 89% 60%)",  label: "text-danger",   bg: "bg-danger/10",   border: "border-danger/20" },
}

export function RslDonutChart({ user }: RslDonutChartProps) {
  const all = getShipments().filter((s) => s.shipperId === user.id)
  const safe     = all.filter((s) => s.rsl > 48).length
  const warning  = all.filter((s) => s.rsl >= 24 && s.rsl <= 48).length
  const critical = all.filter((s) => s.rsl < 24).length
  const total    = all.length

  const data = [
    { name: "Safe >48h",       value: safe,     color: COLORS.safe.fill,     key: "safe" },
    { name: "Warning 24–48h",  value: warning,  color: COLORS.warning.fill,  key: "warning" },
    { name: "Critical <24h",   value: critical, color: COLORS.critical.fill, key: "critical" },
  ].filter((d) => d.value > 0)

  const worstLots = [...all].sort((a, b) => a.rsl - b.rsl).slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Donut */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data.length > 0 ? data : [{ name: "Trống", value: 1, color: "hsl(217 33% 17%)", key: "empty" }]}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={68}
              paddingAngle={data.length > 1 ? 3 : 0}
              dataKey="value"
              stroke="none"
            >
              {(data.length > 0 ? data : [{ color: "hsl(217 33% 17%)" }]).map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(222 47% 9%)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
              formatter={(v: number, name: string) => [`${v} LOT`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-semibold tabular-nums">{total}</p>
          <p className="text-[10px] text-muted-foreground">LOTs</p>
        </div>
      </div>

      {/* Legend chips */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { key: "safe",     label: "Safe",     count: safe,     range: ">48h",    icon: CheckCircle2, style: COLORS.safe },
          { key: "warning",  label: "Warning",  count: warning,  range: "24–48h",  icon: AlertCircle,  style: COLORS.warning },
          { key: "critical", label: "Critical", count: critical, range: "<24h",    icon: AlertTriangle, style: COLORS.critical },
        ].map(({ key, label, count, range, icon: Icon, style }) => (
          <div
            key={key}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 p-2 rounded-md border text-center",
              style.bg, style.border
            )}
          >
            <span className={cn("text-lg font-semibold tabular-nums leading-none", style.label)}>{count}</span>
            <span className={cn("text-[9px] font-medium", style.label)}>{label}</span>
            <span className="text-[8px] text-muted-foreground">{range}</span>
          </div>
        ))}
      </div>

      {/* Worst RSL list */}
      {worstLots.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Worst RSL</p>
          {worstLots.map((s) => {
            const isCrit = s.rsl < 24
            const isWarn = s.rsl >= 24 && s.rsl <= 48
            return (
              <div key={s.id} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                <span className="text-xs font-mono text-muted-foreground truncate max-w-[90px]">{s.id}</span>
                <span className={cn(
                  "text-xs font-semibold tabular-nums",
                  isCrit ? "text-danger" : isWarn ? "text-warning" : "text-success"
                )}>
                  {s.rsl}h
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
