# SmartCont — Demo Scenarios

> 5 kịch bản này PHẢI luôn chạy được end-to-end. Test lại sau mỗi feature lớn.

## Kịch bản 1: Anh Nam ghép cont sầu riêng (MAIN STORYLINE)

**Vai:** Shipper — Trần Văn Nam, vựa Krông Pắc, Đắk Lắk.

**Câu chuyện:**
> "Anh Nam có 4 tấn sầu Ri6 chín trong 5 ngày. Vựa quá nhỏ để book cont nguyên. Anh mở SmartCont để tìm ghép cont."

**Bước demo:**
1. Vào `/` → Click "Bắt đầu" → chọn role "Shipper" → chọn user "Trần Văn Nam"
2. Landing dashboard shipper → click "Tạo lô hàng mới"
3. Nhập form:
   - Sản phẩm: Sầu riêng Ri6
   - Khối lượng: 4000 kg
   - Thể tích: 6.5 m³
   - Ngày cắt: 15/09/2026
   - Độ chín: 70%
   - Nhiệt độ: 15°C
   - Cảng đích: Bằng Tường (qua Hữu Nghị)
   - Deadline: 25/09/2026
4. Submit → **hệ thống tự tính RSL = 16.2 ngày** (hiển thị badge màu xanh)
5. Click "Tìm ghép cont" → **AI loading**:
   - "Đang phân tích 247 lô hàng phù hợp..."
   - "Tính điểm tương thích RSL..."
   - "Kiểm tra ràng buộc nhiệt độ và cảng đích..."
   - "Tối ưu container utilization..."
6. Ra 3 gợi ý ghép cont, top 1 là:
   - Cont **MSKU 7823451** (Reefer 40HC, Vận tải Tuấn Phát)
   - Ghép với **Lê Minh Bình** (3.2 tấn, RSL 15.5) + **Nguyễn Thị Lan** (5.1 tấn, RSL 17.8)
   - Utilization: **91.2%**
   - Compatibility score: **89/100**
   - Reasons: "RSL chênh lệch 2.3 ngày (OK)", "Cùng cảng đích Hữu Nghị", "Nhiệt độ đồng nhất 15°C"
7. Click "Chọn cont này" → confirm → toast success "Đã ghép cont thành công"
8. Redirect sang trang tracking → hiển thị:
   - Phase timeline: "Đã book" (highlighted)
   - Map với vị trí Krông Pắc + tuyến đến Hữu Nghị
   - ETA: "43 giờ 27 phút ±32 phút" — confidence 87%
   - 3 factors: "Cửa khẩu đông do mùa cao điểm" (+6h30), "Khởi hành ban đêm" (-1h20), "Mùa vụ cao điểm sầu riêng"

## Kịch bản 2: Chị Lan book cont nguyên (FCL)

**Vai:** Shipper — Nguyễn Thị Lan, vựa Cai Lậy, Tiền Giang.

**Câu chuyện:**
> "Chị Lan có 5.1 tấn sầu Monthong đủ để book cont nguyên. Chị muốn chọn carrier có rating tốt để đảm bảo chất lượng."

**Bước demo:**
1. Switch user sang "Nguyễn Thị Lan" (từ user switcher góc trên)
2. Vào "Danh sách cont" `/shipper/containers`
3. Filter: Route = "Tiền Giang → Hữu Nghị", Type = "Reefer 20ft"
4. Ra 2 cont, so sánh:
   - Cont **MEDU 9234567** (Reefer Express) — ⭐ 3.7 (12 đánh giá)
   - Cont **FCIU 6789012** (Vận tải Tuấn Phát) — ⭐ 4.6 (18 đánh giá)
5. Click cont thứ 2 → xem chi tiết:
   - Thông tin cont, giá, tuyến
   - **Section "Đánh giá carrier"** với breakdown 4 tiêu chí + top 3 review gần nhất
6. Click "Book cont này" → confirm → toast success
7. Redirect sang tracking page

## Kịch bản 3: Anh Tuấn (carrier) publish chuyến mới

**Vai:** Carrier — Anh Tuấn Transport.

**Câu chuyện:**
> "Anh Tuấn có 1 xe reefer 40HC vừa xong đơn ở HCM, đang trống. Anh muốn publish chuyến mới đi Móng Cái để tìm hàng."

**Bước demo:**
1. Switch role sang "Carrier" → chọn "Anh Tuấn Transport"
2. Dashboard carrier → click "Đăng chuyến mới"
3. Form:
   - Số cont: (auto-generate) `MSKU 5678901`
   - Loại: Reefer 40HC
   - Tuyến: TP.HCM → Móng Cái
   - Ngày khởi hành: 25/09/2026 21:00
   - Nhiệt độ set-point: 15°C
   - Giá cước: 750.000₫/m³, 50.000.000₫/cont nguyên
   - Cho phép ghép cont: ✅
4. Submit → toast success "Đã publish chuyến" → list container hiển thị cont mới
5. Trong 30s sau đó (fake), có notification "Có shipper quan tâm chuyến của bạn" pop up

## Kịch bản 4: Sự cố nhiệt độ giữa đường

**Vai:** Carrier + Shipper (2 tab).

**Câu chuyện:**
> "Cont TRIU 1122334 đang đi (Nguyễn Thị Lan là shipper). Ở Nghệ An, hệ thống phát hiện nhiệt độ trong cont tăng bất thường lên 18°C. Carrier báo sự cố."

**Bước demo (2 tab song song):**

**Tab Carrier:**
1. Vào `/carrier/incidents/new`
2. Chọn cont: TRIU 1122334
3. Loại sự cố: "Sự cố nhiệt độ"
4. Severity: "Warning"
5. Mô tả: "Máy lạnh gặp sự cố nhẹ, nhiệt độ tăng 18°C. Đã dừng xe kiểm tra và khắc phục trong 20 phút. Đang tiếp tục hành trình."
6. Submit → toast

**Tab Shipper (Nguyễn Thị Lan):**
1. Trong khi đang xem tracking → **toast notification pop up**:
   - "⚠️ Sự cố nhiệt độ trên cont TRIU 1122334"
2. Click notification → jump vào chi tiết incident
3. Xem chart nhiệt độ có spike lên 18°C rồi trở về 15°C
4. Xem ETA cập nhật động (+30 phút do dừng khắc phục)

## Kịch bản 5: Rating sau khi hoàn thành

**Vai:** Shipper — Nguyễn Thị Lan.

**Câu chuyện:**
> "Cont TRIU 1122334 vừa giao hàng xong. Chị Lan đánh giá dịch vụ carrier Cold Chain Logistics VN."

**Bước demo:**
1. Vào dashboard shipper → có card "Có 1 chuyến chờ đánh giá" hoặc vào `/shipper/ratings/new/[bookingId]`
2. Form đánh giá:
   - **Đúng giờ:** 4 sao (click từ 1-5)
   - **Giữ nhiệt độ:** 3 sao (do có spike)
   - **Thái độ tài xế:** 5 sao (tài xế báo cáo minh bạch)
   - **Tình trạng hàng khi đến:** 5 sao (hàng vẫn tươi)
   - **Điểm tổng:** auto = 4.25 → làm tròn 4
   - **Review:** "Có sự cố nhiệt độ giữa đường nhưng tài xế xử lý nhanh và báo cáo minh bạch. Hàng vẫn về đúng chất lượng. Đáng tin cậy."
3. Submit → toast success "Cảm ơn đánh giá của bạn"
4. Redirect về dashboard → thấy booking chuyển status "Đã đánh giá"

**Tab Carrier (Cold Chain Logistics VN):**
1. Có notification "Bạn nhận được 1 đánh giá mới"
2. Vào `/carrier/ratings` → thấy review mới ở top
3. Click "Phản hồi" → nhập text → submit
4. Dashboard carrier: điểm rating trung bình cập nhật (fake nhẹ)

---

## Checklist trước mỗi demo

- [ ] Reset demo data (clear localStorage)
- [ ] Test kịch bản 1 (main) chạy hết end-to-end
- [ ] Test kịch bản 2 (FCL) chạy hết
- [ ] Test kịch bản 3 (carrier publish) chạy hết
- [ ] Kịch bản 4 và 5 để nếu còn thời gian
- [ ] Map load thành công (không bị lỗi tiles)
- [ ] Toast notifications hoạt động
- [ ] Phase progression tự chạy (không bị đơ)
- [ ] Console tab sạch (không error/warning)
- [ ] Test trên incognito browser để đảm bảo không phụ thuộc cache
