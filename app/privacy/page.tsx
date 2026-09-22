import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
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
          <Shield className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight">Chính sách bảo mật</h1>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="text-xs">Phiên bản 1.0 — 2026</Badge>
          <span className="text-sm text-muted-foreground">Cập nhật lần cuối: 22/09/2026</span>
        </div>
        <div className="flex gap-2 mb-10">
          <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">GDPR Compliant</Badge>
          <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">PDPD 2023 (VN)</Badge>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Phạm vi thu thập dữ liệu</h2>
            <p>
              SmartDurian thu thập dữ liệu phù hợp với{" "}
              <strong className="text-foreground">Nghị định Bảo vệ Dữ liệu Cá nhân (PDPD) số 13/2023/NĐ-CP</strong>{" "}
              của Việt Nam và các nguyên tắc của{" "}
              <strong className="text-foreground">GDPR (EU) 2016/679</strong>{" "}
              đối với người dùng trong Liên minh Châu Âu.
            </p>
            <p>Nội dung chi tiết đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Mục đích xử lý dữ liệu</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Chia sẻ dữ liệu với bên thứ ba</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Quyền của chủ thể dữ liệu (PDPD 2023 · GDPR)</h2>
            <p>
              Theo PDPD 2023 và GDPR, bạn có các quyền: truy cập, chỉnh sửa, xoá, phản đối xử lý,
              và di chuyển dữ liệu. Để thực hiện các quyền này, liên hệ{" "}
              <a href="mailto:privacy@smartdurian.vn" className="text-accent underline">privacy@smartdurian.vn</a>.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">5. Lưu trữ và bảo mật dữ liệu</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">6. Cookie và tracking</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">7. Liên hệ DPO (Data Protection Officer)</h2>
            <p>
              Mọi yêu cầu liên quan đến bảo vệ dữ liệu cá nhân gửi về:{" "}
              <a href="mailto:dpo@smartdurian.vn" className="text-accent underline">dpo@smartdurian.vn</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground underline">Điều khoản sử dụng</Link>
          <Link href="/dispute" className="hover:text-foreground underline">Giải quyết tranh chấp</Link>
        </div>
      </div>
    </div>
  )
}
