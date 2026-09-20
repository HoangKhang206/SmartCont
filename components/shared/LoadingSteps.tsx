"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStepsProps {
  steps: string[]
  intervalMs?: number
  className?: string
}

export function LoadingSteps({ steps, intervalMs = 1000, className }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep >= steps.length - 1) return
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), intervalMs)
    return () => clearTimeout(timer)
  }, [currentStep, steps.length, intervalMs])

  return (
    <div className={cn("flex flex-col items-center gap-4 py-8", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <p className="text-sm text-muted-foreground animate-pulse min-h-[1.25rem] text-center">
        {steps[currentStep]}
      </p>
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i <= currentStep ? "w-6 bg-accent" : "w-2 bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export const AI_CONSOLIDATION_STEPS = [
  "Đang phân tích 247 lô hàng phù hợp...",
  "Tính điểm tương thích RSL...",
  "Tối ưu utilization container...",
  "Kiểm tra nhiệt độ set-point...",
  "Đang tổng hợp kết quả...",
]

export const AI_ETA_STEPS = [
  "Lấy dữ liệu tuyến đường thực tế...",
  "Phân tích lưu lượng cửa khẩu Hữu Nghị...",
  "Tính toán yếu tố thời tiết...",
  "Hiệu chỉnh ETA theo lịch sử...",
]

export const AI_MATCHING_STEPS = [
  "Tìm kiếm cont phù hợp với lô hàng...",
  "Đánh giá carrier theo rating...",
  "Tính giá tối ưu...",
]
