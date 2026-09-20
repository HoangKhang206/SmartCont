"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/shared/StarRating"
import { toast } from "sonner"
// data store read/writes go through localStorage directly in updateRatingResponse
import { formatDate } from "@/lib/utils"
import type { Rating } from "@/lib/types"

// saveRating in data-store only appends; we need an updater for carrier response
function updateRatingResponse(ratingId: string, text: string): void {
  if (typeof window === "undefined") return
  const key = "smartcont:ratings"
  try {
    const raw = localStorage.getItem(key)
    const list: Rating[] = raw ? JSON.parse(raw) : []
    const idx = list.findIndex((r) => r.id === ratingId)
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        carrierResponse: { text, respondedAt: new Date().toISOString() },
      }
      localStorage.setItem(key, JSON.stringify(list))
    }
  } catch {
    // silent
  }
}

interface RatingCardProps {
  rating: Rating
  showResponse?: boolean
}

export function RatingCard({ rating, showResponse = true }: RatingCardProps) {
  const [responding, setResponding] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const hasResponse = !!rating.carrierResponse

  const criteria = [
    { key: "punctuality", label: "Đúng giờ", value: rating.criteria.punctuality },
    { key: "coldChain", label: "Giữ nhiệt độ", value: rating.criteria.coldChain },
    { key: "driverAttitude", label: "Thái độ tài xế", value: rating.criteria.driverAttitude },
    { key: "cargoCondition", label: "Tình trạng hàng", value: rating.criteria.cargoCondition },
  ]

  async function handleRespond() {
    if (!responseText.trim()) return
    await new Promise((r) => setTimeout(r, 500))
    updateRatingResponse(rating.id, responseText.trim())
    toast.success("Đã gửi phản hồi!")
    setSubmitted(true)
    setResponding(false)
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-sm">{rating.shipperName}</p>
          <p className="text-xs text-muted-foreground">{formatDate(rating.createdAt)}</p>
        </div>
        <StarRating value={rating.overallScore} readOnly size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {criteria.map((c) => (
          <div key={c.key} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{c.label}</span>
            <StarRating value={c.value} readOnly size="sm" />
          </div>
        ))}
      </div>

      {rating.reviewText && (
        <p className="text-sm text-muted-foreground border-t border-border pt-3 line-clamp-3">
          "{rating.reviewText}"
        </p>
      )}

      {showResponse && (
        <div className="border-t border-border pt-3">
          {hasResponse || submitted ? (
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Phản hồi của bạn</p>
              <p className="text-sm">{rating.carrierResponse?.text ?? responseText}</p>
            </div>
          ) : responding ? (
            <div className="space-y-2">
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Cảm ơn exporter đã sử dụng dịch vụ..."
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setResponding(false)}>Hủy</Button>
                <Button size="sm" onClick={handleRespond} disabled={!responseText.trim()}>Gửi phản hồi</Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => setResponding(true)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Phản hồi đánh giá
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
