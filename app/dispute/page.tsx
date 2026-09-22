import Link from "next/link"
import { Scale, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const steps = [
  {
    step: "01",
    title: "Gửi khiếu nại",
    desc: "Exporter hoặc Carrier gửi khiếu nại qua nền tảng trong vòng 7 ngày kể từ sự kiện. Đính kèm bằng chứng: ảnh, log nhiệt độ, GPS.",
  },
  {
    step: "02",
    title: "Hòa giải tự động",
    desc: "SmartDurian gửi thông báo cho bên còn lại và đề xuất giải pháp trong 48 giờ. Nếu 2 bên đồng ý, tiền Escrow được giải ngân theo thỏa thuận.",
  },
  {
    step: "03",
    title: "Xét xử nội bộ",
    desc: "Nếu không hòa giải được, SmartDurian Dispute Committee xem xét bằng chứng và ra quyết định trong 5 ngày làm việc.",
  },
  {
    step: "04",
    title: "Phán quyết cuối cùng",
    desc: "Quyết định của Committee là ràng buộc. Các bên có thể khiếu nại lên VIAC (Trung tâm Trọng tài Quốc tế Việt Nam) nếu không đồng ý.",
  },
]

export default function DisputePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="md" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Trang chủ</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight">Cơ chế giải quyết tranh chấp</h1>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <Badge variant="outline" className="text-xs">Phiên bản 1.0 — 2026</Badge>
          <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">SmartDurian Escrow</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          SmartDurian sử dụng cơ chế Escrow: tiền của Exporter được giữ an toàn trên nền tảng và chỉ
          giải ngân cho Carrier sau khi hàng đến đích thành công hoặc khi tranh chấp được giải quyết.
          Quy trình dưới đây áp dụng khi có bất đồng giữa 2 bên.
        </p>

        {/* Process steps */}
        <div className="space-y-4 mb-10">
          {steps.map((item) => (
            <Card key={item.step} className="p-5 flex gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                <span className="text-xs font-semibold text-accent">{item.step}</span>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Grounds for dispute */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">Các căn cứ khiếu nại được chấp nhận</h2>
          <ul className="space-y-2">
            {[
              "Nhiệt độ container vượt ngưỡng set-point > 2°C trong > 2 giờ liên tục (log GPS)",
              "Trễ ETA > 24 giờ so với dự báo tại thời điểm ký booking",
              "Hàng thiếu cân khi đến điểm nhận (cần biên bản cân tại cảng/cửa khẩu)",
              "Hàng bị hư hỏng rõ ràng do bảo quản sai nhiệt độ (cần ảnh, biên bản giám định)",
              "Carrier hủy chuyến đơn phương sau khi đã nhận thanh toán",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 p-4 rounded-md bg-muted/50 border border-border text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Liên hệ hỗ trợ tranh chấp</p>
          <p>Email: <a href="mailto:dispute@smartdurian.vn" className="text-accent underline">dispute@smartdurian.vn</a></p>
          <p className="mt-1">Hotline: 1800-xxxx (08:00–18:00, T2–T7)</p>
          <p className="mt-2 text-xs">Nội dung chi tiết đang được hoàn thiện theo quy định pháp luật Việt Nam.</p>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground underline">Điều khoản sử dụng</Link>
          <Link href="/privacy" className="hover:text-foreground underline">Chính sách bảo mật</Link>
        </div>
      </div>
    </div>
  )
}
