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

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Giới thiệu và phạm vi áp dụng</h2>
            <p>
              SmartDurian là nền tảng kết nối kỹ thuật số trung gian giữa <strong className="text-foreground">Exporter</strong>{" "}
              (chủ vựa / nhà xuất khẩu nông sản) và <strong className="text-foreground">Carrier</strong>{" "}
              (doanh nghiệp vận tải container lạnh) phục vụ xuất khẩu nông sản theo đường bộ tiểu ngạch và chính ngạch
              qua các cửa khẩu biên giới Việt–Trung.
            </p>
            <p>
              Bằng việc truy cập hoặc sử dụng nền tảng SmartDurian (website, ứng dụng di động, API), bạn xác nhận rằng
              đã đọc, hiểu và đồng ý bị ràng buộc bởi toàn bộ các điều khoản dưới đây.
              Nếu bạn không đồng ý, vui lòng ngừng sử dụng nền tảng.
            </p>
            <p>
              Các điều khoản này được điều chỉnh bởi <strong className="text-foreground">Luật Thương mại Việt Nam số 36/2005/QH11</strong>,{" "}
              <strong className="text-foreground">Bộ luật Dân sự 2015</strong>, và các văn bản pháp luật liên quan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Điều kiện đăng ký và sử dụng</h2>
            <p>Để sử dụng SmartDurian, bạn phải đáp ứng đồng thời các điều kiện:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Là cá nhân từ đủ 18 tuổi hoặc đại diện hợp pháp của tổ chức/doanh nghiệp;</li>
              <li>Có đăng ký kinh doanh hợp lệ tại Việt Nam (đối với tài khoản doanh nghiệp);</li>
              <li>Cung cấp thông tin xác minh danh tính đầy đủ, chính xác và cập nhật;</li>
              <li>Không thuộc danh sách cấm giao dịch của Nhà nước hoặc các cơ quan quản lý xuất nhập khẩu.</li>
            </ul>
            <p>
              SmartDurian có quyền từ chối hoặc đình chỉ tài khoản nếu thông tin đăng ký không trung thực,
              hoặc tài khoản bị sử dụng vi phạm pháp luật, bao gồm nhưng không giới hạn ở hành vi gian lận,
              giả mạo chứng từ, hoặc vận chuyển hàng cấm.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Quyền và nghĩa vụ của Exporter</h2>
            <p><strong className="text-foreground">Quyền của Exporter:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Tìm kiếm và đặt booking container lạnh (FCL/LCL) theo nhu cầu;</li>
              <li>Nhận báo cáo theo dõi hành trình và nhiệt độ cold chain theo thời gian thực;</li>
              <li>Đánh giá carrier sau mỗi chuyến hàng hoàn thành;</li>
              <li>Được bảo vệ quyền lợi tài chính thông qua cơ chế Escrow của nền tảng.</li>
            </ul>
            <p className="mt-2"><strong className="text-foreground">Nghĩa vụ của Exporter:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                Cung cấp thông tin lô hàng chính xác: trọng lượng, thể tích, loại sản phẩm,{" "}
                <strong className="text-foreground">RSL (Remaining Shelf Life)</strong>, yêu cầu nhiệt độ;
              </li>
              <li>
                Đối với sầu riêng xuất khẩu sang Trung Quốc: cung cấp{" "}
                <strong className="text-foreground">Mã số vùng trồng</strong> và{" "}
                <strong className="text-foreground">Mã số cơ sở đóng gói</strong> do Cục Bảo vệ thực vật (Cục BVTV)
                cấp theo Nghị định thư Việt–Trung 2022;
              </li>
              <li>Thanh toán đầy đủ và đúng hạn theo hình thức đã chọn (toàn bộ hoặc đặt cọc);</li>
              <li>Không kê khai sai RSL để hưởng lợi thế trong ghép cont — hành vi này là vi phạm hợp đồng;</li>
              <li>Cung cấp bằng chứng hợp lệ khi khiếu nại (ảnh, log nhiệt độ, biên bản cân).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Quyền và nghĩa vụ của Carrier</h2>
            <p><strong className="text-foreground">Quyền của Carrier:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Đăng tải thông tin chuyến, tuyến đường, sức chứa và giá cước;</li>
              <li>Tự do chấp nhận hoặc từ chối booking trong thời hạn 24 giờ;</li>
              <li>Nhận thanh toán qua Escrow ngay khi hàng đến đích được xác nhận;</li>
              <li>Phản hồi khiếu nại và trình bày bằng chứng phản biện.</li>
            </ul>
            <p className="mt-2"><strong className="text-foreground">Nghĩa vụ của Carrier:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                Duy trì nhiệt độ container trong phạm vi set-point ±1.5°C trong suốt hành trình;
                sai lệch vượt 2°C liên tục &gt;2 giờ được tính là vi phạm cold chain;
              </li>
              <li>Cập nhật phase (trạng thái hành trình) kịp thời trên nền tảng;</li>
              <li>Thông báo ngay khi xảy ra sự cố nhiệt độ, tai nạn, hoặc chậm ETA &gt;2 giờ;</li>
              <li>Có giấy phép vận tải hàng lạnh hợp lệ và bảo hiểm hàng hóa trong suốt thời gian hoạt động;</li>
              <li>Không hủy chuyến đơn phương sau khi booking đã được thanh toán.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">5. Thanh toán, Escrow và hoàn tiền</h2>
            <p>
              SmartDurian áp dụng mô hình <strong className="text-foreground">Escrow</strong>: toàn bộ tiền thanh toán
              của Exporter được giữ trên tài khoản trung gian của nền tảng và chỉ được giải ngân cho Carrier sau khi
              hàng đến đích thành công hoặc sau khi tranh chấp được giải quyết.
            </p>
            <p><strong className="text-foreground">Cấu trúc phí:</strong></p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Cước vận chuyển (freight): theo thỏa thuận 2 bên;</li>
              <li>Phí thông quan cửa khẩu: 2.500.000 VND/cont (mức cố định);</li>
              <li>Hoa hồng nền tảng SmartDurian: 2,5% trên cước vận chuyển;</li>
              <li>Thuế GTGT (VAT): 10% trên phí thông quan và hoa hồng nền tảng.</li>
            </ul>
            <p>
              <strong className="text-foreground">Hình thức thanh toán:</strong> Carrier có thể cấu hình
              &quot;Thanh toán toàn bộ&quot; (1 lần khi booking) hoặc &quot;Đặt cọc&quot; (giai đoạn 1: X% khi booking,
              giai đoạn 2: phần còn lại khi hàng đến nơi).
            </p>
            <p>
              <strong className="text-foreground">Hoàn tiền:</strong> Trong trường hợp carrier hủy chuyến
              hoặc vi phạm cold chain được xác nhận bởi Dispute Committee, toàn bộ tiền Escrow được hoàn trả
              cho Exporter trong vòng 3–5 ngày làm việc.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">6. Hệ thống đánh giá và xếp hạng</h2>
            <p>
              SmartDurian áp dụng hệ thống đánh giá 4 tiêu chí: Cold Chain, Đúng giờ, Tài xế, Hồ sơ chứng từ.
              Đánh giá được công khai và ảnh hưởng đến khả năng hiển thị carrier trong kết quả tìm kiếm.
            </p>
            <p>
              Carrier có quyền phản hồi đánh giá trong vòng 7 ngày. Đánh giá bị xác định là gian lận hoặc sai sự
              thật (có bằng chứng) sẽ bị gỡ bỏ sau khi SmartDurian xem xét.
            </p>
            <p>
              Tài khoản carrier có rating trung bình dưới 3.0★ sau 10 chuyến sẽ bị tạm khóa để xem xét.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">7. Giới hạn trách nhiệm</h2>
            <p>
              SmartDurian hoạt động với tư cách <strong className="text-foreground">trung gian kết nối</strong>{" "}
              và không phải là bên vận chuyển hay bảo hiểm hàng hóa. Trách nhiệm của SmartDurian bị giới hạn ở:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Đảm bảo tính chính xác của thông tin hiển thị trên nền tảng;</li>
              <li>Vận hành cơ chế Escrow và giải ngân đúng hạn;</li>
              <li>Cung cấp hệ thống theo dõi hành trình và thông báo kịp thời.</li>
            </ul>
            <p>
              SmartDurian <strong className="text-foreground">không chịu trách nhiệm</strong> về:
              thiệt hại gián tiếp, mất mát lợi nhuận, thiệt hại do thiên tai, sự kiện bất khả kháng
              (ùn tắc cửa khẩu do chính sách nhà nước, đóng cửa biên giới), hoặc vi phạm từ phía carrier/exporter.
            </p>
            <p>
              Tổng trách nhiệm của SmartDurian trong bất kỳ trường hợp nào không vượt quá giá trị hoa hồng
              nền tảng đã thu trong giao dịch liên quan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">8. Sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung trên nền tảng SmartDurian — bao gồm logo, giao diện, mã nguồn, thuật toán
              tối ưu ghép cont, dữ liệu ETA và các tài liệu kỹ thuật — là tài sản trí tuệ của SmartDurian,
              được bảo hộ theo <strong className="text-foreground">Luật Sở hữu trí tuệ Việt Nam số 50/2005/QH11</strong>.
            </p>
            <p>
              Người dùng không được phép sao chép, tái tạo, phân phối, hoặc sử dụng thương mại bất kỳ
              phần nào của nền tảng mà không có sự chấp thuận bằng văn bản từ SmartDurian.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">9. Chấm dứt tài khoản</h2>
            <p>
              Người dùng có thể yêu cầu xóa tài khoản bất kỳ lúc nào bằng cách liên hệ{" "}
              <a href="mailto:support@smartdurian.vn" className="text-accent underline">support@smartdurian.vn</a>.
              SmartDurian sẽ xử lý yêu cầu trong 30 ngày làm việc, sau khi đảm bảo không còn booking
              đang thực hiện hoặc tranh chấp chưa giải quyết.
            </p>
            <p>
              SmartDurian có quyền đình chỉ hoặc chấm dứt tài khoản mà không cần thông báo trước
              trong trường hợp vi phạm nghiêm trọng các điều khoản này hoặc pháp luật Việt Nam.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">10. Luật áp dụng và liên hệ</h2>
            <p>
              Các điều khoản này được điều chỉnh bởi pháp luật Cộng hòa xã hội chủ nghĩa Việt Nam.
              Mọi tranh chấp phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết theo{" "}
              <Link href="/dispute" className="text-accent underline">Cơ chế giải quyết tranh chấp</Link> của SmartDurian.
              Nếu tranh chấp không được giải quyết nội bộ, các bên có thể đưa ra VIAC hoặc Tòa án có thẩm quyền
              tại TP. Hồ Chí Minh.
            </p>
            <p>
              Mọi góp ý về điều khoản:{" "}
              <a href="mailto:legal@smartdurian.vn" className="text-accent underline">legal@smartdurian.vn</a>
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
