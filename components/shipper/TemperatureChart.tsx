"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Thermometer } from "lucide-react"

interface TempPoint {
  time: string
  temp: number
}

interface TemperatureChartProps {
  data: TempPoint[]
  setpointC: number
  className?: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-sm">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium">{payload[0].value}°C</p>
    </div>
  )
}

export function TemperatureChart({ data, setpointC, className }: TemperatureChartProps) {
  const max = Math.max(...data.map((d) => d.temp), setpointC + 3)
  const min = Math.min(...data.map((d) => d.temp), setpointC - 2)

  return (
    <Card className={className}>
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Thermometer className="h-4 w-4 text-cold" />
        <p className="text-sm font-medium">Nhiệt độ cont</p>
        <span className="ml-auto text-xs text-muted-foreground">Set-point: {setpointC}°C</span>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[min - 1, max + 1]} unit="°" />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={setpointC} stroke="hsl(var(--cold))" strokeDasharray="4 2" label={{ value: `${setpointC}°C`, position: "insideTopRight", fontSize: 9, fill: "hsl(var(--cold))" }} />
            <Line type="monotone" dataKey="temp" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "hsl(var(--accent))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function generateFakeTemperatureData(setpointC: number, hoursBack = 12): TempPoint[] {
  const points: TempPoint[] = []
  const now = new Date()
  for (let i = hoursBack; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600 * 1000)
    const hour = t.getHours().toString().padStart(2, "0") + ":00"
    const noise = (Math.random() - 0.5) * 0.8
    const spike = i === Math.floor(hoursBack / 3) ? 3 : 0
    points.push({ time: hour, temp: Math.round((setpointC + noise + spike) * 10) / 10 })
  }
  return points
}
