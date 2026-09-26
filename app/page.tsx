import Link from "next/link"
import {
  ArrowRight,
  GitMerge,
  Timer,
  Star,
  Snowflake,
  Truck,
  Warehouse,
  CheckCircle2,
  TrendingUp,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/shared/Logo"

const features = [
  {
    icon: GitMerge,
    badge: "RSL-Aware",
    title: "Ghép cont theo RSL",
    description:
      "Hệ thống tự động so khớp lô hàng dựa trên Remaining Shelf Life, đảm bảo hàng ghép chung không ảnh hưởng chất lượng lẫn nhau. Container utilization đạt 90–95%.",
    points: ["Chênh lệch RSL ≤ 3 ngày", "Cùng nhiệt độ set-point ±1°C", "Thứ tự bốc dỡ tối ưu theo RSL"],
  },
  {
    icon: Timer,
    badge: "AI Prediction",
    title: "Dự báo ETA động",
    description:
      "Không phải ETA tĩnh từ Google Maps. Mô hình tính lại mỗi 15 phút dựa trên thời tiết, tắc cửa khẩu, ngày lễ VN/TQ — chính xác hơn 5× so với baseline.",
    points: ["Cập nhật theo thời tiết dọc tuyến", "Tắc cửa khẩu Hữu Nghị, Móng Cái", "Confidence score + margin ±phút"],
  },
  {
    icon: Star,
    badge: "Trust Layer",
    title: "Rating 4 tiêu chí",
    description:
      "Rating đa chiều dành riêng cho logistics B2B: đúng giờ, giữ nhiệt độ, thái độ tài xế, tình trạng hàng khi đến. Doanh nghiệp xem trước khi book, carrier cạnh tranh bằng chất lượng.",
    points: ["Punctuality — Cold Chain — Driver — Cargo", "Chỉ doanh nghiệp đã hoàn thành booking mới đánh giá", "Carrier phản hồi công khai"],
  },
]

const stats = [
  { value: "247", unit: "cont", label: "đã ghép thành công" },
  { value: "91.3%", unit: "", label: "container utilization TB" },
  { value: "43", unit: "doanh nghiệp", label: "SME đang sử dụng" },
  { value: "5.2×", unit: "", label: "ETA chính xác hơn Google Maps" },
]

const roles = [
  {
    icon: Warehouse,
    title: "Doanh nghiệp (Exporter)",
    subtitle: "Doanh nghiệp nông sản 3–15 tấn/lô",
    color: "border-accent/30 hover:border-accent",
    points: [
      "Tìm cont phù hợp RSL theo tuyến, ngày",
      "Ghép cont với doanh nghiệp khác — giảm chi phí",
      "Tracking real-time + AI ETA",
      "Đánh giá carrier sau mỗi chuyến",
    ],
  },
  {
    icon: Truck,
    title: "Bên vận chuyển (Carrier)",
    subtitle: "Đơn vị sở hữu xe reefer",
    color: "border-primary/20 hover:border-primary/50",
    points: [
      "Publish chuyến, tìm hàng tự động",
      "Tối đa utilization — giảm xe trống",
      "Cập nhật phase trực tiếp từ app",
      "Xây dựng rating, tăng cạnh tranh",
    ],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/select-role">Đăng nhập</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/select-role">
                Bắt đầu <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <Badge variant="outline" className="mb-6 border-accent/40 text-accent bg-accent/5 text-xs font-medium px-3 py-1">
          <Snowflake className="h-3 w-3 mr-1.5" />
          Cold Chain Logistics · SME Nông Sản
        </Badge>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground max-w-3xl mx-auto leading-tight mb-6">
          Ghép container lạnh{" "}
          <span className="text-accent">thông minh</span>{" "}
          cho doanh nghiệp nông sản xuất khẩu
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Nền tảng booking và ghép cont reefer theo RSL — kèm AI dự báo ETA động và rating đa chiều.
          Giảm chi phí 8–12%, utilization đạt 90–95%. Dành riêng cho SME 3–15 tấn/lô.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" className="px-8" asChild>
            <Link href="/select-role">
              Bắt đầu ngay <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link href="/select-role">Xem demo</Link>
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Tuyến Đắk Lắk → Hữu Nghị · Tiền Giang → Móng Cái · Bến Tre → Hữu Nghị
        </p>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-semibold tabular-nums text-foreground">
                  {stat.value}
                  {stat.unit && <span className="text-lg ml-1 text-muted-foreground font-normal">{stat.unit}</span>}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">3 tính năng lõi</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Được thiết kế riêng cho logistics tiểu ngạch — không phải platform giá cước biển hay đặt xe thông thường.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div key={feat.title} className="border border-border rounded-lg p-6 bg-card flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-medium border-border text-muted-foreground">
                    {feat.badge}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-base font-medium mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
                <ul className="space-y-1.5 mt-auto pt-2 border-t border-border">
                  {feat.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* For who */}
      <section className="bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold tracking-tight mb-3">Dành cho ai?</h2>
            <p className="text-muted-foreground text-sm">Hai vai trò, một nền tảng — giao dịch trực tiếp, không qua trung gian.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div
                  key={role.title}
                  className={`border-2 rounded-lg p-6 bg-background transition-colors ${role.color}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{role.title}</p>
                      <p className="text-xs text-muted-foreground">{role.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {role.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Quy trình 3 bước</h2>
          <p className="text-muted-foreground text-sm">Từ lô hàng đến cửa khẩu — toàn bộ trên SmartDurian.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-border" />
          {[
            {
              step: "01",
              icon: Warehouse,
              title: "Tạo lô hàng",
              desc: "Nhập thông tin: loại nông sản, khối lượng, ngày cắt, độ chín, cảng đích. Hệ thống tự tính RSL.",
            },
            {
              step: "02",
              icon: GitMerge,
              title: "Ghép hoặc book cont",
              desc: "AI tìm cont phù hợp RSL và nhiệt độ. Xem gợi ý ghép, so sánh giá, xem rating carrier.",
            },
            {
              step: "03",
              icon: TrendingUp,
              title: "Track real-time",
              desc: "Xem vị trí cont trên bản đồ, AI ETA cập nhật động, nhận thông báo khi có sự cố hoặc phase mới.",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="text-center px-4 relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card mx-auto mb-4 relative">
                  <Icon className="h-6 w-6 text-accent" />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mb-4">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Sẵn sàng tối ưu cold chain?</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Tham gia cùng 43 doanh nghiệp nông sản đang dùng SmartDurian để xuất khẩu hiệu quả hơn.
          </p>
          <Button size="lg" className="px-10" asChild>
            <Link href="/select-role">
              Bắt đầu miễn phí <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <Logo size="sm" href="/" />
          <p className="text-xs text-muted-foreground">
            Nền tảng booking & ghép container lạnh cho SME nông sản · Tuyến tiểu ngạch Việt – Trung
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Bảo mật</Link>
            <Link href="/dispute" className="hover:text-foreground transition-colors">Tranh chấp</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
