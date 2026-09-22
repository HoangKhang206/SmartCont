import Link from "next/link"
import { Scale, ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const steps = [
  {
    step: "01",
    title: "Gửi khiếu nại",
    time: "Trong 7 ngày",
    desc: "Exporter hoặc Carrier gửi khiếu nại qua mục Hỗ trợ trên nền tảng trong vòng 7 ngày kể từ sự kiện. Đính kèm bằng chứng: ảnh hàng hóa, log nhiệt độ, dữ liệu GPS hành trình, biên bản cân tại cảng/cửa khẩu.",
  },
  {
    step: "02",
    title: "Hòa giải trực tiếp",
    time: "48 giờ",
    desc: "SmartDurian gửi thông báo cho bên còn lại và đề xuất giải pháp dựa trên dữ liệu hệ thống trong 48 giờ. Nếu cả 2 bên đồng ý phương án, tiền Escrow được giải ngân theo thỏa thuận ngay trong ngày làm việc tiếp theo.",
  },
  {
    step: "03",
    title: "Xét xử nội bộ",
    time: "5 ngày làm việc",
    desc: "Nếu hòa giải không thành, SmartDurian Dispute Committee (gồm chuyên gia logistics và pháp lý) xem xét toàn bộ bằng chứng và ra quyết định độc lập trong 5 ngày làm việc. Các bên có thể nộp thêm bằng chứng bổ sung trong vòng 48 giờ đầu.",
  },
  {
    step: "04",
    title: "Phán quyết và thực thi",
    time: "Ràng buộc",
    desc: "Quyết định của Committee là ràng buộc và được thực thi thông qua Escrow. Các bên không đồng ý có thể khiếu nại lên VIAC (Trung tâm Trọng tài Quốc tế Việt Nam) hoặc Tòa án có thẩm quyền tại TP. Hồ Chí Minh.",
  },
]

const acceptedGrounds = [
  {
    icon: "cold",
    text: "Nhiệt độ container vượt ngưỡng set-point > 2°C trong > 2 giờ liên tục (có log GPS/IoT làm bằng chứng)",
  },
  {
    icon: "late",
    text: "Trễ ETA > 24 giờ so với dự báo xác nhận tại thời điểm ký booking, không do sự kiện bất khả kháng",
  },
  {
    icon: "weight",
    text: "Hàng thiếu cân khi đến điểm nhận (cần biên bản cân có chữ ký tại cảng hoặc cửa khẩu)",
  },
  {
    icon: "damage",
    text: "Hàng hư hỏng rõ ràng do bảo quản sai nhiệt độ — cần ảnh, biên bản giám định độc lập",
  },
  {
    icon: "cancel",
    text: "Carrier hủy chuyến đơn phương sau khi đã nhận đặt cọc hoặc thanh toán toàn bộ",
  },
  {
    icon: "fraud",
    text: "Exporter kê khai sai RSL hoặc thông tin lô hàng dẫn đến thiệt hại cho carrier hoặc nền tảng",
  },
]

const notAccepted = [
  "Chậm trễ do chính sách đóng cửa biên giới, thiên tai, dịch bệnh (bất khả kháng theo Điều 294 Luật Thương mại)",
  "Chậm trễ do ùn tắc tại cửa khẩu vượt quá 6 giờ — được coi là rủi ro ngành, không phải lỗi carrier",
  "Hư hỏng hàng do bao bì không đủ tiêu chuẩn từ phía Exporter",
  "Khiếu nại sau quá 7 ngày kể từ sự kiện mà không có lý do chính đáng được chấp thuận trước",
  "Tranh chấp về giá cước đã được 2 bên chấp nhận khi xác nhận booking",
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
          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">VIAC</Badge>
        </div>

        {/* Escrow overview */}
        <div className="p-4 rounded-md border border-accent/25 bg-accent/5 text-sm text-muted-foreground leading-relaxed mb-10">
          <p className="font-medium text-foreground mb-1.5">Cơ chế Escrow bảo vệ cả 2 bên</p>
          <p>
            Toàn bộ tiền thanh toán của Exporter được giữ an toàn trong tài khoản Escrow trung gian của SmartDurian
            và <strong className="text-foreground">chỉ giải ngân cho Carrier sau khi</strong>:
            (1) Exporter xác nhận hàng đã đến đích an toàn, hoặc (2) thời hạn khiếu nại 7 ngày hết mà không có tranh chấp,
            hoặc (3) tranh chấp được giải quyết theo quy trình dưới đây.
          </p>
        </div>

        {/* Process steps */}
        <h2 className="text-base font-semibold mb-4">Quy trình 4 bước</h2>
        <div className="space-y-3 mb-10">
          {steps.map((item) => (
            <Card key={item.step} className="p-5 flex gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-accent">{item.step}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* SLA table */}
        <h2 className="text-base font-semibold mb-4">Cam kết thời gian xử lý (SLA)</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-xs border border-border rounded-md overflow-hidden">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2.5 font-medium text-foreground border-b border-border">Loại xử lý</th>
                <th className="text-left p-2.5 font-medium text-foreground border-b border-border">Thời gian</th>
                <th className="text-left p-2.5 font-medium text-foreground border-b border-border">Kênh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-2.5">Xác nhận tiếp nhận khiếu nại</td><td className="p-2.5 font-medium text-foreground">2 giờ làm việc</td><td className="p-2.5">Email tự động</td></tr>
              <tr><td className="p-2.5">Hòa giải tự động (2 bên đồng ý)</td><td className="p-2.5 font-medium text-foreground">48 giờ</td><td className="p-2.5">In-app + Email</td></tr>
              <tr><td className="p-2.5">Xét xử nội bộ bởi Committee</td><td className="p-2.5 font-medium text-foreground">5 ngày làm việc</td><td className="p-2.5">Email chính thức</td></tr>
              <tr><td className="p-2.5">Giải ngân Escrow sau phán quyết</td><td className="p-2.5 font-medium text-foreground">1 ngày làm việc</td><td className="p-2.5">Chuyển khoản</td></tr>
              <tr><td className="p-2.5">Hoàn tiền cho Exporter (nếu carrier lỗi)</td><td className="p-2.5 font-medium text-foreground">3–5 ngày làm việc</td><td className="p-2.5">Tài khoản ngân hàng</td></tr>
            </tbody>
          </table>
        </div>

        {/* Accepted grounds */}
        <div className="space-y-3 mb-10">
          <h2 className="text-base font-semibold">Căn cứ khiếu nại được chấp nhận</h2>
          <ul className="space-y-2">
            {acceptedGrounds.map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Not accepted */}
        <div className="space-y-3 mb-10">
          <h2 className="text-base font-semibold">Trường hợp không được chấp nhận khiếu nại</h2>
          <ul className="space-y-2">
            {notAccepted.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-danger/70 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence guide */}
        <div className="space-y-3 mb-10">
          <h2 className="text-base font-semibold">Hướng dẫn chuẩn bị bằng chứng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Log nhiệt độ & GPS", desc: "Xuất file CSV từ hệ thống IoT container. SmartDurian lưu tự động, bạn có thể tải từ trang chi tiết chuyến." },
              { label: "Ảnh hàng hóa", desc: "Chụp ngay khi mở cont tại điểm nhận. Ảnh cần có timestamp, chụp toàn cảnh và close-up hư hỏng." },
              { label: "Biên bản cân", desc: "Biên bản cân tại cảng/cửa khẩu có chữ ký của cả 2 bên và dấu cơ quan kiểm dịch (nếu có)." },
              { label: "Chứng từ xuất khẩu", desc: "Hóa đơn thương mại, packing list, certificate of origin, phytosanitary certificate từ Cục BVTV." },
            ].map((item) => (
              <div key={item.label} className="p-3.5 rounded-md border border-border bg-muted/30 space-y-1">
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VIAC note */}
        <div className="p-4 rounded-md border border-border bg-muted/30 text-sm text-muted-foreground mb-8">
          <p className="font-medium text-foreground mb-1.5">Trọng tài quốc tế — VIAC</p>
          <p className="leading-relaxed">
            Nếu không đồng ý với phán quyết nội bộ, các bên có quyền đưa tranh chấp ra xét xử tại{" "}
            <strong className="text-foreground">Trung tâm Trọng tài Quốc tế Việt Nam (VIAC)</strong>,
            theo Luật Trọng tài Thương mại số 54/2010/QH12. Phán quyết trọng tài VIAC là chung thẩm,
            có giá trị thi hành như bản án của Tòa án.
          </p>
          <p className="mt-1.5 text-xs">
            Website: viac.vn · Hotline: (028) 3823 1034
          </p>
        </div>

        {/* Contact */}
        <div className="p-4 rounded-md bg-muted/50 border border-border text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1.5">Liên hệ hỗ trợ tranh chấp</p>
          <p>Email: <a href="mailto:dispute@smartdurian.vn" className="text-accent underline">dispute@smartdurian.vn</a></p>
          <p className="mt-0.5">Hotline: 1800-8088 (08:00–18:00, Thứ 2–Thứ 7)</p>
          <p className="mt-1.5 text-xs text-muted-foreground/70">
            Phản hồi trong vòng 2 giờ làm việc. Ngoài giờ hành chính, liên hệ qua email để được xử lý
            vào đầu ngày làm việc tiếp theo.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground underline">Điều khoản sử dụng</Link>
          <Link href="/privacy" className="hover:text-foreground underline">Chính sách bảo mật</Link>
        </div>
      </div>
    </div>
  )
}
