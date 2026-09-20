"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { addNotification } from "@/lib/data-store"
import { generateId, randomInt } from "@/lib/utils"
import type { User, NotificationType } from "@/lib/types"

interface NotifTemplate {
  type: NotificationType
  title: string
  message: string
}

const SHIPPER_TEMPLATES: NotifTemplate[] = [
  { type: "phase_update", title: "Cập nhật hành trình", message: "Cont của bạn đang di chuyển đúng lịch trình, qua trạm kiểm soát Bắc Trung Bộ." },
  { type: "eta_change", title: "ETA cập nhật", message: "Dự kiến đến cửa khẩu Hữu Nghị sớm hơn 42 phút do tuyến thông thoáng." },
  { type: "eta_change", title: "Cửa khẩu thông thoáng", message: "Tình trạng Hữu Nghị hiện bình thường. ETA đang đúng kế hoạch." },
  { type: "phase_update", title: "Cont đến vựa", message: "Tài xế đã đến điểm gom hàng. Bắt đầu xếp dỡ trong ~30 phút." },
]

const CARRIER_TEMPLATES: NotifTemplate[] = [
  { type: "consolidation_match", title: "Exporter quan tâm chuyến của bạn", message: "3 exporter đang xem cont của bạn trong 10 phút qua. Giá cước đang cạnh tranh tốt." },
  { type: "booking_confirmed", title: "Cơ hội ghép cont mới", message: "Có lô sầu riêng 4 tấn (RSL 16 ngày) đang cần ghép cont trên tuyến của bạn." },
  { type: "rating_received", title: "Nhận xét từ cộng đồng", message: "Exporter đánh giá cold chain của bạn tốt. Rating trung bình đang tăng." },
]

export function useNotificationSimulator(user: User | null) {
  useEffect(() => {
    if (!user) return

    let timeoutId: ReturnType<typeof setTimeout>

    function schedule() {
      const delay = randomInt(65_000, 90_000) // 65-90 giây
      timeoutId = setTimeout(() => {
        const templates = user!.role === "shipper" ? SHIPPER_TEMPLATES : CARRIER_TEMPLATES
        const tpl = templates[randomInt(0, templates.length - 1)]

        addNotification({
          id: generateId("notif"),
          userId: user!.id,
          type: tpl.type,
          title: tpl.title,
          message: tpl.message,
          read: false,
          createdAt: new Date().toISOString(),
        })

        toast.info(tpl.title, { description: tpl.message, duration: 5000 })
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeoutId)
  }, [user?.id])
}
