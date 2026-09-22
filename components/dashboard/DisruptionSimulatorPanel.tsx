"use client"

import { useState } from "react"
import { Play, Zap, CheckCircle2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Scenario {
  id: string
  label: string
  emoji: string
  desc: string
  impact: {
    containers: string
    rslRisk: string
    cost: string
    service: string
    costUp: boolean
    serviceUp: boolean
  }
}

const SCENARIOS: Scenario[] = [
  {
    id: "fwd_delay",
    label: "FWD delay",
    emoji: "⏱️",
    desc: "Cửa khẩu FWD A chậm +6h do kiểm tra hải quan tăng cường",
    impact: { containers: "12 → 14", rslRisk: "3 → 1 ↓", cost: "+4.2%", service: "96% → 98% ↑", costUp: true, serviceUp: true },
  },
  {
    id: "shortage",
    label: "Container shortage",
    emoji: "📦",
    desc: "Quy Nhơn thiếu cont: 3 cont bị giữ do kiểm định đột xuất",
    impact: { containers: "12 → 11", rslRisk: "3 → 2 ↓", cost: "+8.1%", service: "96% → 91% ↓", costUp: true, serviceUp: false },
  },
  {
    id: "temp_deviation",
    label: "Temperature deviation",
    emoji: "🌡️",
    desc: "+2°C sai lệch nhiệt độ phát hiện trong transit Khánh Hòa",
    impact: { containers: "12 → 12", rslRisk: "3 → 5 ↑", cost: "+1.7%", service: "96% → 94% ↓", costUp: true, serviceUp: false },
  },
  {
    id: "eta_change",
    label: "ETA change",
    emoji: "🌧️",
    desc: "Mưa lớn khu vực Lạng Sơn — ETA tất cả chuyến tăng thêm +4h",
    impact: { containers: "12 → 13", rslRisk: "3 → 2 ↓", cost: "+2.3%", service: "96% → 97% ↑", costUp: true, serviceUp: true },
  },
  {
    id: "multiple",
    label: "Multiple disruptions",
    emoji: "⚡",
    desc: "FWD delay + container shortage đồng thời — kịch bản xấu nhất",
    impact: { containers: "12 → 15", rslRisk: "3 → 0 ↓", cost: "+11.4%", service: "96% → 95% ↓", costUp: true, serviceUp: false },
  },
]

export function DisruptionSimulatorPanel() {
  const [selected, setSelected] = useState<string>("fwd_delay")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<Scenario | null>(null)
  const [step, setStep] = useState(0)

  const STEPS = [
    "Phân tích mạng lưới container...",
    "Tính toán lại ETA + RSL...",
    "Tối ưu phân bổ lại...",
    "Hoàn thành — kết quả bên dưới",
  ]

  async function handleRun() {
    const scenario = SCENARIOS.find((s) => s.id === selected)
    if (!scenario) return
    setResult(null)
    setRunning(true)
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i)
      await new Promise((r) => setTimeout(r, 700))
    }
    setRunning(false)
    setResult(scenario)
  }

  function handleReset() {
    setResult(null)
    setStep(0)
  }

  const scenario = SCENARIOS.find((s) => s.id === selected)!

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Zap className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold">Disruption Simulator</h3>
        <Badge className="ml-auto text-[9px] h-4 px-1.5 bg-accent/20 text-accent border-accent/30 hover:bg-accent/20">
          AI Beta
        </Badge>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed flex-shrink-0">
        Kiểm tra kịch bản gián đoạn và xem SmartDurian tối ưu lại như thế nào.
      </p>

      {/* Scenario list */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSelected(s.id); handleReset() }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg border text-xs transition-all",
              selected === s.id
                ? "border-accent/40 bg-accent/8 text-foreground"
                : "border-border/40 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none flex-shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium leading-tight", selected === s.id && "text-accent")}>{s.label}</p>
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">{s.desc}</p>
              </div>
              {selected === s.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Run button */}
      <Button
        className="w-full gap-2"
        onClick={handleRun}
        disabled={running}
        size="sm"
      >
        {running ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            {STEPS[step]}
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5 fill-current" />
            Chạy mô phỏng
          </>
        )}
      </Button>

      {/* Result */}
      {result && !running && (
        <div className="space-y-2 border-t border-border/60 pt-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <p className="text-[11px] font-semibold text-foreground">Expected Impact</p>
            <span className="text-[10px] text-muted-foreground">(after simulation)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "Tái phân bổ", value: result.impact.containers, icon: RefreshCw, up: true, neutral: true },
              { label: "RSL risk",    value: result.impact.rslRisk,    icon: TrendingDown, up: false },
              { label: "Total cost",  value: result.impact.cost,       icon: TrendingUp, up: result.impact.costUp },
              { label: "Service",     value: result.impact.service,    icon: TrendingUp, up: result.impact.serviceUp },
            ].map(({ label, value, up, neutral }) => (
              <div key={label} className={cn(
                "px-2.5 py-2 rounded-md border text-center",
                neutral
                  ? "bg-accent/8 border-accent/20"
                  : up
                  ? "bg-success/8 border-success/20"
                  : "bg-warning/8 border-warning/20"
              )}>
                <p className={cn(
                  "text-sm font-semibold tabular-nums leading-tight",
                  neutral ? "text-accent" : up ? "text-success" : "text-warning"
                )}>{value}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
