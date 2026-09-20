"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { StarRating } from "@/components/shared/StarRating"
import { saveRating, saveBooking, getBookings } from "@/lib/data-store"
import { generateId } from "@/lib/utils"
import type { User, Booking } from "@/lib/types"

interface RatingFormProps {
  booking: Booking
  carrierId: string
  carrierName: string
  user: User
}

const criteria = [
  { key: "punctuality" as const, label: "Đúng giờ", desc: "Đến vựa và giao hàng đúng lịch" },
  { key: "coldChain" as const, label: "Giữ nhiệt độ", desc: "Cold chain ổn định suốt hành trình" },
  { key: "driverAttitude" as const, label: "Thái độ tài xế", desc: "Giao tiếp, hỗ trợ khi có sự cố" },
  { key: "cargoCondition" as const, label: "Tình trạng hàng", desc: "Hàng đến nơi còn nguyên vẹn, không hư hỏng" },
]

export function RatingForm({ booking, carrierId, carrierName, user }: RatingFormProps) {
  const router = useRouter()
  const [scores, setScores] = useState({ punctuality: 0, coldChain: 0, driverAttitude: 0, cargoCondition: 0 })
  const [reviewText, setReviewText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const overall = Object.values(scores).every(Boolean)
    ? Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / 4) * 10) / 10
    : 0

  async function handleSubmit() {
    if (!Object.values(scores).every(Boolean)) {
      toast.error("Vui lòng chọn sao cho tất cả 4 tiêu chí")
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))

    const ratingId = generateId("rating")
    const now = new Date()
    const editableUntil = new Date(now.getTime() + 7 * 24 * 3600 * 1000)

    saveRating({
      id: ratingId,
      bookingId: booking.id,
      containerId: booking.containerId,
      shipperId: user.id,
      shipperName: user.name,
      carrierId,
      carrierName,
      overallScore: overall,
      criteria: scores,
      reviewText,
      createdAt: now.toISOString(),
      editableUntil: editableUntil.toISOString(),
    })

    saveBooking({ ...booking, ratingId, status: "completed" })

    toast.success("Cảm ơn đánh giá của bạn!", {
      description: `Điểm tổng: ${overall}/5 sao cho ${carrierName}`,
    })
    router.push("/shipper/dashboard")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {criteria.map((c) => (
          <Card key={c.key} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <StarRating
                value={scores[c.key]}
                onChange={(v) => setScores((prev) => ({ ...prev, [c.key]: v }))}
                size="lg"
              />
            </div>
          </Card>
        ))}
      </div>

      {overall > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Điểm tổng tự động:</p>
          <p className="text-2xl font-semibold tabular-nums">{overall}</p>
          <StarRating value={Math.round(overall)} readOnly size="sm" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="review">Nhận xét (không bắt buộc)</Label>
        <Textarea
          id="review"
          placeholder="Chia sẻ trải nghiệm của bạn với carrier này..."
          rows={4}
          maxLength={500}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{reviewText.length}/500</p>
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    </div>
  )
}
