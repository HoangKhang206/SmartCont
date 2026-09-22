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
          <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">GDPR (EU) 2016/679</Badge>
          <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">PDPD — NĐ 13/2023/NĐ-CP</Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-10">
          SmartDurian cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập,
          sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân, phù hợp với{" "}
          <strong className="text-foreground">Nghị định Bảo vệ Dữ liệu Cá nhân (PDPD) số 13/2023/NĐ-CP</strong>{" "}
          của Việt Nam và{" "}
          <strong className="text-foreground">Quy định Bảo vệ Dữ liệu Chung (GDPR) 2016/679</strong>{" "}
          của Liên minh Châu Âu đối với người dùng trong vùng lãnh thổ EU.
        </p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Thông tin chúng tôi thu thập</h2>
            <p><strong className="text-foreground">Dữ liệu nhận dạng và liên hệ:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Họ tên, số điện thoại, địa chỉ email, địa chỉ doanh nghiệp;</li>
              <li>Mã số thuế, số Giấy chứng nhận đăng ký kinh doanh (đối với tài khoản doanh nghiệp);</li>
              <li>Thông tin người đại diện pháp luật.</li>
            </ul>
            <p className="mt-2"><strong className="text-foreground">Dữ liệu giao dịch và logistics:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Thông tin lô hàng: loại nông sản, trọng lượng, thể tích, RSL, nhiệt độ yêu cầu;</li>
              <li>Mã số vùng trồng và mã số cơ sở đóng gói (do Cục BVTV cấp, chỉ áp dụng với sầu riêng xuất TQ);</li>
              <li>Lịch sử booking, trạng thái thanh toán và dữ liệu Escrow;</li>
              <li>Dữ liệu GPS hành trình container và log nhiệt độ cold chain.</li>
            </ul>
            <p className="mt-2"><strong className="text-foreground">Dữ liệu kỹ thuật:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian truy cập;</li>
              <li>Cookie phiên làm việc và cookie phân tích (xem mục 6).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Mục đích xử lý dữ liệu</h2>
            <p>SmartDurian xử lý dữ liệu cá nhân dựa trên các căn cứ pháp lý hợp lệ cho các mục đích sau:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2.5 font-medium text-foreground border-b border-border">Mục đích</th>
                    <th className="text-left p-2.5 font-medium text-foreground border-b border-border">Căn cứ pháp lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-2.5">Xác minh danh tính và onboarding tài khoản</td><td className="p-2.5">Thực hiện hợp đồng (Điều 6(1)(b) GDPR; Điều 17 PDPD)</td></tr>
                  <tr><td className="p-2.5">Kết nối Exporter và Carrier, xử lý booking</td><td className="p-2.5">Thực hiện hợp đồng</td></tr>
                  <tr><td className="p-2.5">Xử lý thanh toán và quản lý Escrow</td><td className="p-2.5">Thực hiện hợp đồng + Nghĩa vụ pháp lý</td></tr>
                  <tr><td className="p-2.5">Theo dõi hành trình, cảnh báo nhiệt độ</td><td className="p-2.5">Lợi ích hợp pháp (bảo vệ hàng hóa)</td></tr>
                  <tr><td className="p-2.5">Giải quyết tranh chấp và hỗ trợ khách hàng</td><td className="p-2.5">Lợi ích hợp pháp + Nghĩa vụ pháp lý</td></tr>
                  <tr><td className="p-2.5">Cải thiện thuật toán gợi ý ghép cont (AI)</td><td className="p-2.5">Lợi ích hợp pháp (dữ liệu được ẩn danh hóa)</td></tr>
                  <tr><td className="p-2.5">Gửi thông báo dịch vụ và cập nhật quan trọng</td><td className="p-2.5">Lợi ích hợp pháp</td></tr>
                  <tr><td className="p-2.5">Gửi email marketing, tin tức ngành</td><td className="p-2.5">Sự đồng ý (có thể rút lại bất kỳ lúc nào)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Chia sẻ dữ liệu với bên thứ ba</h2>
            <p>
              SmartDurian <strong className="text-foreground">không bán</strong> dữ liệu cá nhân của bạn.
              Chúng tôi chỉ chia sẻ dữ liệu trong các trường hợp sau:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">Đối tác vận hành nền tảng:</strong>{" "}
                nhà cung cấp cloud hosting (máy chủ tại Singapore/Việt Nam), cổng thanh toán được cấp phép bởi NHNN Việt Nam,
                nhà cung cấp dịch vụ SMS/email thông báo;
              </li>
              <li>
                <strong className="text-foreground">Đối tác logistics:</strong>{" "}
                thông tin booking và hành trình được chia sẻ với carrier/exporter trong cùng giao dịch;
              </li>
              <li>
                <strong className="text-foreground">Cơ quan nhà nước:</strong>{" "}
                Cục BVTV, Hải quan, cơ quan quản lý xuất nhập khẩu khi có yêu cầu hợp pháp;
              </li>
              <li>
                <strong className="text-foreground">VIAC hoặc Tòa án:</strong>{" "}
                khi cần thiết trong quá trình giải quyết tranh chấp.
              </li>
            </ul>
            <p>
              Mọi bên thứ ba nhận dữ liệu đều phải ký thỏa thuận bảo mật (DPA) và chỉ được xử lý dữ liệu
              theo đúng mục đích đã được phê duyệt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Quyền của chủ thể dữ liệu</h2>
            <p>
              Theo <strong className="text-foreground">PDPD 2023 (Điều 9–16)</strong> và{" "}
              <strong className="text-foreground">GDPR (Điều 15–22)</strong>, bạn có các quyền sau:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-foreground">Quyền truy cập:</strong> Yêu cầu bản sao dữ liệu cá nhân chúng tôi đang lưu giữ về bạn;</li>
              <li><strong className="text-foreground">Quyền chỉnh sửa:</strong> Yêu cầu sửa thông tin không chính xác hoặc không đầy đủ;</li>
              <li><strong className="text-foreground">Quyền xóa (quyền được lãng quên):</strong> Yêu cầu xóa dữ liệu khi không còn cần thiết, trừ khi có nghĩa vụ pháp lý lưu giữ;</li>
              <li><strong className="text-foreground">Quyền hạn chế xử lý:</strong> Yêu cầu tạm ngừng xử lý dữ liệu trong thời gian xem xét khiếu nại;</li>
              <li><strong className="text-foreground">Quyền di chuyển dữ liệu:</strong> Nhận dữ liệu dưới định dạng có thể đọc bằng máy (JSON/CSV) để chuyển sang nền tảng khác;</li>
              <li><strong className="text-foreground">Quyền phản đối:</strong> Phản đối xử lý dữ liệu vì mục đích marketing hoặc phân tích hành vi;</li>
              <li><strong className="text-foreground">Quyền rút lại đồng ý:</strong> Rút lại đồng ý bất kỳ lúc nào mà không ảnh hưởng đến tính hợp pháp của xử lý trước đó.</li>
            </ul>
            <p>
              Để thực hiện các quyền trên, liên hệ:{" "}
              <a href="mailto:privacy@smartdurian.vn" className="text-accent underline">privacy@smartdurian.vn</a>.
              Chúng tôi sẽ phản hồi trong vòng <strong className="text-foreground">30 ngày</strong> theo quy định PDPD 2023
              (hoặc 1 tháng theo GDPR, có thể gia hạn thêm 2 tháng với trường hợp phức tạp).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">5. Lưu trữ, bảo mật và thời gian giữ dữ liệu</h2>
            <p><strong className="text-foreground">Bảo mật kỹ thuật:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Mã hóa dữ liệu truyền tải: TLS 1.3;</li>
              <li>Mã hóa dữ liệu lưu trữ: AES-256;</li>
              <li>Kiểm soát truy cập theo nguyên tắc tối thiểu quyền hạn (Least Privilege);</li>
              <li>Kiểm tra bảo mật và pentest định kỳ 6 tháng/lần;</li>
              <li>Hệ thống phát hiện xâm nhập (IDS) và giám sát 24/7.</li>
            </ul>
            <p className="mt-2"><strong className="text-foreground">Thời gian lưu trữ:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Dữ liệu tài khoản hoạt động: lưu trữ trong suốt thời gian sử dụng;</li>
              <li>Dữ liệu giao dịch và chứng từ xuất khẩu: 5 năm (theo Luật Kế toán và Luật Hải quan);</li>
              <li>Log nhiệt độ và GPS: 2 năm (phục vụ giải quyết tranh chấp);</li>
              <li>Dữ liệu marketing: cho đến khi bạn rút lại đồng ý.</li>
            </ul>
            <p>
              Máy chủ chính đặt tại <strong className="text-foreground">Việt Nam</strong>.
              Một số dịch vụ bên thứ ba có thể xử lý dữ liệu tại Singapore (AWS ap-southeast-1)
              với đầy đủ biện pháp bảo vệ theo Điều 46 GDPR và Chương V PDPD 2023.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">6. Cookie và công nghệ theo dõi</h2>
            <p>SmartDurian sử dụng các loại cookie sau:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">Cookie bắt buộc:</strong>{" "}
                Duy trì phiên đăng nhập, bảo mật CSRF, lưu ngôn ngữ giao diện. Không thể tắt.
              </li>
              <li>
                <strong className="text-foreground">Cookie phân tích:</strong>{" "}
                Đo lường hiệu suất tính năng (Google Analytics 4 với IP ẩn danh). Có thể từ chối.
              </li>
              <li>
                <strong className="text-foreground">Cookie chức năng:</strong>{" "}
                Ghi nhớ bộ lọc tìm kiếm, tuyến đường thường dùng. Có thể từ chối.
              </li>
            </ul>
            <p>
              Bạn có thể quản lý cookie qua cài đặt trình duyệt hoặc banner cookie khi lần đầu truy cập nền tảng.
              Từ chối cookie phân tích không ảnh hưởng đến các tính năng cốt lõi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">7. Thông báo vi phạm dữ liệu</h2>
            <p>
              Trong trường hợp xảy ra vi phạm bảo mật dữ liệu có nguy cơ ảnh hưởng đến quyền và lợi ích của bạn,
              SmartDurian cam kết:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Thông báo cho Bộ Công an (Cục An toàn thông tin) trong vòng <strong className="text-foreground">72 giờ</strong> kể từ khi phát hiện (theo PDPD 2023 và GDPR Điều 33);</li>
              <li>Thông báo trực tiếp đến người dùng bị ảnh hưởng qua email trong vòng <strong className="text-foreground">72 giờ</strong> nếu vi phạm ở mức nguy cơ cao (Điều 34 GDPR);</li>
              <li>Công bố báo cáo sự cố công khai sau khi điều tra hoàn tất.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">8. Liên hệ và Data Protection Officer (DPO)</h2>
            <p>
              SmartDurian đã chỉ định <strong className="text-foreground">Cán bộ Bảo vệ Dữ liệu (DPO)</strong>{" "}
              theo yêu cầu của GDPR (Điều 37) và PDPD 2023 (Điều 28).
            </p>
            <div className="p-4 rounded-md bg-muted/40 border border-border space-y-1">
              <p>Email DPO: <a href="mailto:dpo@smartdurian.vn" className="text-accent underline">dpo@smartdurian.vn</a></p>
              <p>Email chung: <a href="mailto:privacy@smartdurian.vn" className="text-accent underline">privacy@smartdurian.vn</a></p>
              <p>Địa chỉ: Đại học Khoa học Tự nhiên TP.HCM, 227 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</p>
            </div>
            <p>
              Nếu không hài lòng với cách SmartDurian xử lý khiếu nại về dữ liệu, bạn có quyền
              gửi khiếu nại lên <strong className="text-foreground">Bộ Công an — Cục An toàn thông tin</strong>{" "}
              (Việt Nam) hoặc Cơ quan bảo vệ dữ liệu của quốc gia thành viên EU nơi bạn cư trú.
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
