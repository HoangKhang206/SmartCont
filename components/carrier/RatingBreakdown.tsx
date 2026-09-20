"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StarRating } from "@/components/shared/StarRating"
import { getRatingsByCarrierId } from "@/lib/data-store"
import type { User } from "@/lib/types"

interface RatingBreakdownProps {
  user: User
}

export function RatingBreakdown({ user }: RatingBreakdownProps) {
  const ratings = getRatingsByCarrierId(user.id)
  if (ratings.length === 0) return (
    <div className="py-8 text-center text-sm text-muted-foreground">Chưa có đánh giá nào.</div>
  )

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star: `${star}★`,
    count: ratings.filter((r) => r.overallScore === star).length,
  }))
  const avg = ratings.reduce((s, r) => s + r.overallScore, 0) / ratings.length

  const avgCriteria = {
    punctuality: ratings.reduce((s, r) => s + r.criteria.punctuality, 0) / ratings.length,
    coldChain: ratings.reduce((s, r) => s + r.criteria.coldChain, 0) / ratings.length,
    driverAttitude: ratings.reduce((s, r) => s + r.criteria.driverAttitude, 0) / ratings.length,
    cargoCondition: ratings.reduce((s, r) => s + r.criteria.cargoCondition, 0) / ratings.length,
  }

  const criteriaLabels = [
    { key: "punctuality", label: "Đúng giờ" },
    { key: "coldChain", label: "Giữ nhiệt độ" },
    { key: "driverAttitude", label: "Thái độ tài xế" },
    { key: "cargoCondition", label: "Tình trạng hàng" },
  ] as const

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-semibold tabular-nums">{avg.toFixed(1)}</p>
          <StarRating value={Math.round(avg)} readOnly size="sm" className="mt-1 justify-center" />
          <p className="text-xs text-muted-foreground mt-1">{ratings.length} đánh giá</p>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={dist} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="star" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip formatter={(v) => [`${v} đánh giá`, ""]} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={12}>
                {dist.map((d, i) => (
                  <Cell key={i} fill={d.count > 0 ? "hsl(var(--warning))" : "hsl(var(--muted))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Criteria breakdown */}
      <div className="space-y-2 pt-3 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Chi tiết 4 tiêu chí</p>
        {criteriaLabels.map(({ key, label }) => {
          const score = avgCriteria[key]
          return (
            <div key={key} className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground w-28 flex-shrink-0">{label}</p>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${(score / 5) * 100}%` }} />
              </div>
              <span className="text-xs font-medium tabular-nums w-8 text-right">{score.toFixed(1)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
