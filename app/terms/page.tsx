import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
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
          <FileText className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight">Điều khoản sử dụng</h1>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <Badge variant="outline" className="text-xs">Phiên bản 1.0 — 2026</Badge>
          <span className="text-sm text-muted-foreground">Cập nhật lần cuối: 22/09/2026</span>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Giới thiệu</h2>
            <p>Nội dung chi tiết đang được cập nhật. Vui lòng liên hệ SmartDurian để biết thêm thông tin.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Điều kiện sử dụng nền tảng</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Quyền và nghĩa vụ của Exporter</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Quyền và nghĩa vụ của Carrier</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">5. Thanh toán và hoàn tiền</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">6. Giới hạn trách nhiệm</h2>
            <p>Nội dung đang được biên soạn.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">7. Luật áp dụng</h2>
            <p>Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp được giải quyết theo{" "}
              <Link href="/dispute" className="text-accent underline">Cơ chế giải quyết tranh chấp</Link> của SmartDurian.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground underline">Chính sách bảo mật</Link>
          <Link href="/dispute" className="hover:text-foreground underline">Giải quyết tranh chấp</Link>
        </div>
      </div>
    </div>
  )
}
