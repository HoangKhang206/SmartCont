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
  {
    type: "phase_update",
    title: "📦 Cont đang trên đường — cập nhật vị trí",
    message: "Cont đang ở Quốc lộ 1A, km 812, Hà Tĩnh. Tốc độ 76 km/h. Nhiệt độ: 15.1°C — ổn định.",
  },
  {
    type: "phase_update",
    title: "🌡️ Báo cáo cold chain tự động",
    message: "Nhiệt độ trung bình 6 giờ qua: 15.2°C (±0.3°C). Độ ẩm: 87%. Hệ thống lạnh hoạt động bình thường.",
  },
  {
    type: "phase_update",
    title: "🚛 Cont vừa qua trạm kiểm soát Bắc Hải Vân",
    message: "Cont đã qua trạm lúc 03:17. Dự kiến đến Đồng Hới trong 2 giờ 15 phút. Không có sự cố.",
  },
  {
    type: "phase_update",
    title: "📍 Cập nhật GPS — 78% quãng đường",
    message: "Vị trí: QL1A, Nghệ An — 78% hành trình hoàn thành. Cont đúng lộ trình, ETA không thay đổi.",
  },
  {
    type: "eta_change",
    title: "⏱️ ETA cập nhật — sớm hơn 47 phút",
    message: "Tuyến QL1A thông thoáng hơn dự báo. ETA mới: đến Hữu Nghị sớm hơn 47 phút. Confidence 91%.",
  },
  {
    type: "eta_change",
    title: "🌧️ Mưa nhẹ Lạng Sơn — ETA +23 phút",
    message: "Dự báo mưa nhỏ đèo Bắc Sơn. ETA tăng thêm 23 phút. Cont đang di chuyển an toàn, nhiệt độ ổn định.",
  },
  {
    type: "eta_change",
    title: "🛃 Cửa khẩu Hữu Nghị thông thoáng",
    message: "Thời gian thông quan hiện tại: ~2h 10p (mức bình thường). ETA đúng lịch. Không có sự cố đặc biệt.",
  },
  {
    type: "eta_change",
    title: "⚡ Chuyển cao tốc — tiết kiệm 1h 12p",
    message: "Tài xế dùng cao tốc Bắc Trung Bộ. ETA cập nhật: tiết kiệm 1 giờ 12 phút. Confidence 94%.",
  },
  {
    type: "incident",
    title: "ℹ️ Dừng kỹ thuật định kỳ — 30 phút",
    message: "Tài xế dừng kiểm tra tại trạm nghỉ Thanh Hóa (kiểm tra lốp, nhiên liệu). ETA +30p. Tất cả ổn định.",
  },
  {
    type: "phase_update",
    title: "🏁 Cont sắp đến cửa khẩu — 45 phút",
    message: "Còn 45 phút là cont đến cửa khẩu Hữu Nghị. Hồ sơ thông quan đã được chuẩn bị. Chuẩn bị theo dõi.",
  },
]

const CARRIER_TEMPLATES: NotifTemplate[] = [
  {
    type: "consolidation_match",
    title: "👀 4 exporter đang xem cont của bạn",
    message: "Cont MSKU 7823451 (Đắk Lắk → Hữu Nghị): 4 lô sầu riêng đang xem xét ghép — 18.2 m³, utilization tiềm năng 87%.",
  },
  {
    type: "consolidation_match",
    title: "🔗 Cơ hội ghép — lô Monthong RSL 18 ngày",
    message: "Lô sầu riêng Monthong 5.2 tấn (RSL 18 ngày, 15°C) cần cont tuyến Tiền Giang → Hữu Nghị. Phù hợp chuyến của bạn.",
  },
  {
    type: "booking_confirmed",
    title: "🔔 Exporter lưu cont vào danh sách theo dõi",
    message: "3 exporter đã bookmark cont của bạn. Rating 4.8★ đang là điểm mạnh thu hút booking trên SmartDurian.",
  },
  {
    type: "rating_received",
    title: "⭐ Đánh giá mới 5★ từ exporter",
    message: "Cold chain 5★ · Đúng giờ 4★ · Tài xế 5★ — \"Nhiệt độ giữ hoàn hảo. Sầu riêng đến tươi nguyên. Sẽ book lại lần sau.\"",
  },
  {
    type: "rating_received",
    title: "📈 Rating của bạn tăng lên 4.7★",
    message: "Bạn đang ở Top 15% carrier trên SmartDurian tuyến Đắk Lắk. Tiếp tục duy trì để nhận badge Carrier Tin Cậy.",
  },
  {
    type: "phase_update",
    title: "📋 Nhắc nhở: Cập nhật phase khi đến vựa",
    message: "Cont dự kiến đến điểm gom hàng trong 2 giờ. Cập nhật phase giúp exporter theo dõi và tăng uy tín carrier.",
  },
  {
    type: "booking_confirmed",
    title: "💰 Nhận đặt cọc 30% — tiền trong Escrow",
    message: "Exporter đã thanh toán cọc 30% cho booking trên cont của bạn. Tiền đang được giữ an toàn trong SmartDurian Escrow.",
  },
  {
    type: "eta_change",
    title: "🏆 Cont đến sớm — cơ hội tăng rating",
    message: "Cont dự kiến đến trước lịch 35 phút. Exporter đã được thông báo — đây là cơ hội tốt để tăng điểm Punctuality.",
  },
]

export function useNotificationSimulator(user: User | null) {
  useEffect(() => {
    if (!user) return

    let timeoutId: ReturnType<typeof setTimeout>

    function schedule() {
      const delay = randomInt(22_000, 42_000) // 22-42s cho demo ấn tượng
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

        if (tpl.type === "incident") {
          toast.warning(tpl.title.replace(/^[^\w]*/, ""), { description: tpl.message, duration: 7000 })
        } else {
          toast.info(tpl.title.replace(/^[^\w]*/, ""), { description: tpl.message, duration: 5000 })
        }

        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeoutId)
  }, [user?.id])
}
