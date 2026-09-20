# SmartCont — Nền tảng Booking & Ghép Container Lạnh cho SME Nông Sản

> *Tên dự án tạm — có thể đổi thành ContShare, ColdShare, ConsolFlow, v.v.*

---

## 1. Tổng quan

**SmartCont** là nền tảng web demo giúp các vựa nông sản nhỏ và vừa (SME) **đặt container lạnh** hoặc **ghép chung container** khi xuất khẩu, kết hợp **theo dõi hành trình real-time** và **AI dự báo thời gian đến** (Dynamic ETA Prediction).

- **Lĩnh vực:** Cold Chain Logistics — Freight Consolidation
- **Ngách:** SME nông sản (sầu riêng, xoài, thanh long) xuất tiểu ngạch qua cửa khẩu Lạng Sơn
- **Định dạng:** Web application (2 interface theo vai trò)
- **Mục tiêu:** Sản phẩm demo cho cuộc thi chuyên ngành Logistics

---

## 2. Bối cảnh & Vấn đề

### 2.1. Bối cảnh

- Mùa vụ sầu riêng Đắk Lắk (tháng 7–10) sản lượng tăng đột biến → kho lạnh quá tải, thiếu vỏ container lạnh, cửa khẩu tắc nghẽn.
- Vựa lớn có mối quen với forwarder, book cont nguyên (FCL) dễ dàng.
- **Vựa nhỏ 3–8 tấn/lô** không đủ hàng để book cont nguyên → phải:
  - Qua trung gian forwarder (mất 3–5 ngày, phí cao)
  - Hoặc để hàng chờ trong kho → **giảm chất lượng, mất giá**

### 2.2. Pain point chính

| Vấn đề | Ảnh hưởng |
|---|---|
| Vựa nhỏ không đủ hàng book cont nguyên | Phụ thuộc forwarder, biên lợi nhuận thấp |
| Không có kênh ghép hàng chung cont với vựa khác | Bỏ lỡ cơ hội tối ưu chi phí |
| Không theo dõi được vị trí hàng | Không kịp ứng phó khi trễ |
| Không dự báo được thời gian đến chính xác | Khó lên kế hoạch bốc dỡ, hải quan |
| Sầu riêng chín nhanh, chậm 1 ngày là mất giá | Thiệt hại lớn khi cont trễ |

### 2.3. Insight cốt lõi

> **Không phải thiếu công nghệ tracking — mà thiếu công cụ phù hợp cho SME.** Các platform hiện tại (Maersk Captain Peter, project44, Phaata) phục vụ shipper lớn với đơn tối thiểu 3.000 USD. Vựa nhỏ bị bỏ quên.

---

## 3. Đối tượng người dùng

### 3.1. Chủ vựa (Shipper)
- Vựa sầu riêng/nông sản quy mô 3–15 tấn/lô
- HTX, hộ kinh doanh cá thể
- Địa bàn: Đắk Lắk, Tiền Giang, Bến Tre
- Nhu cầu: xuất tiểu ngạch Trung Quốc qua cửa khẩu Lạng Sơn/Móng Cái

### 3.2. Bên vận chuyển (Carrier)
- Đơn vị sở hữu/vận hành xe container lạnh
- Forwarder nhỏ có xe riêng
- Nhu cầu: tối đa hoá utilization xe/cont, giảm thời gian tìm hàng

---

## 4. Tính năng chính

### 4.1. Interface Chủ vựa

| Tính năng | Mô tả |
|---|---|
| **Tìm kiếm cont theo filter** | Lọc theo: tuyến đường, ngày khởi hành, loại cont (20ft/40ft reefer), giá tham khảo, carrier |
| **Tham khảo giá dịch vụ** | Bảng giá cước tham khảo, so sánh giữa các carrier |
| **Book cont nguyên (FCL)** | Đặt trọn 1 cont cho lô hàng lớn |
| **Ghép cont (LCL)** | Đăng ký ghép chung cont với vựa khác dựa trên **chỉ số RSL** |
| **Theo dõi phase cont** | Xem trạng thái: `Đã book → Đến vựa → Đang bốc → Đang di chuyển → Đến cửa khẩu → Thông quan → Đến đích` |
| **AI dự báo ETA** | Xem thời gian dự kiến đến (cập nhật động theo thời tiết, tắc cửa khẩu) |
| **Map real-time** | Bản đồ hiển thị vị trí cont + tuyến đường + ETA |
| **Nhận thông báo** | Push notification khi cont sắp đến, có sự cố, ETA thay đổi |
| **Đánh giá & Vote sao carrier** | Sau khi hoàn thành chuyến, chủ vựa đánh giá dịch vụ theo thang 5 sao + review chi tiết (đúng giờ, giữ nhiệt độ, thái độ tài xế, tình trạng hàng khi đến) |
| **Xem lịch sử đánh giá của carrier** | Trước khi book, xem điểm trung bình + review của các vựa trước đó để chọn carrier uy tín |

### 4.2. Interface Bên vận chuyển

| Tính năng | Mô tả |
|---|---|
| **Đăng ký thông tin đơn vị** | Tên công ty, giấy phép, số lượng đầu xe, loại cont sở hữu |
| **Đăng ký cont/chuyến** | Nhập số cont, thể tích, tải trọng, tuyến đường, ngày khởi hành, giá cước |
| **Định tuyến sẵn** | Chọn tuyến từ danh sách (Đắk Lắk → Lạng Sơn, TPHCM → Móng Cái, v.v.) |
| **Xem đơn book** | Danh sách các vựa đã book cont/ghép cont |
| **Báo sự cố** | Thông báo cho chủ vựa khi gặp: hỏng xe, tắc đường, sự cố nhiệt độ |
| **Cập nhật phase** | Bấm cập nhật trạng thái khi đến từng điểm |
| **Xem đánh giá & phản hồi** | Xem các review của chủ vựa dành cho mình, phản hồi công khai để giải thích các đánh giá tiêu cực |
| **Dashboard điểm uy tín** | Xem điểm trung bình, xu hướng đánh giá theo thời gian, các tiêu chí bị điểm thấp cần cải thiện |

---

## 4A. Tính năng Đánh giá & Vote sao (Rating System)

### 4A.1. Mục đích

- **Xây dựng lòng tin** giữa hai phía trên marketplace (giống cơ chế Grab, Shopee)
- **Giảm rủi ro cho vựa nhỏ** khi book carrier lạ — có thể tham khảo review trước
- **Tạo động lực cạnh tranh lành mạnh** giữa các carrier về chất lượng dịch vụ
- **Data để hệ thống ưu tiên carrier tốt** trong kết quả tìm kiếm

### 4A.2. Cấu trúc đánh giá

**Thang điểm tổng thể:** 1–5 sao

**4 tiêu chí chi tiết** (mỗi tiêu chí 1–5 sao):

| Tiêu chí | Ý nghĩa |
|---|---|
| ⏱️ **Đúng giờ (Punctuality)** | Đến vựa và giao hàng đúng lịch không |
| ❄️ **Giữ nhiệt độ (Cold Chain Integrity)** | Nhiệt độ trong cont có ổn định không |
| 🚚 **Thái độ tài xế (Driver Attitude)** | Thái độ giao tiếp, hỗ trợ khi có sự cố |
| 📦 **Tình trạng hàng khi đến (Cargo Condition)** | Sầu riêng có bị dập, chín ép, mất RSL không |

**Review text:** Bình luận tối đa 500 ký tự, có thể đính kèm ảnh (bằng chứng).

### 4A.3. Cơ chế hiển thị

- **Trên listing cont:** hiển thị badge sao trung bình + tổng số review
- **Trên profile carrier:** biểu đồ phân bố đánh giá + top review gần nhất
- **Lọc theo rating:** vựa có thể filter "chỉ hiển thị carrier ≥ 4 sao"
- **Sắp xếp:** mặc định carrier điểm cao lên trước

### 4A.4. Chống gian lận (nhắc ở mức concept, không cần code demo)

- Chỉ vựa **đã hoàn thành booking** mới được đánh giá
- Mỗi booking chỉ đánh giá 1 lần, không sửa sau 7 ngày
- Carrier có thể **flag review nghi ngờ** để admin xem xét
- Hiển thị badge "Đánh giá đã xác thực" cho review từ booking thật

### 4A.5. Trong pitch cho giám khảo

> Tính năng này thể hiện **hiểu ngành logistics B2B**: khác với B2C (Grab, Shopee) chỉ cần rating chung, logistics cần **rating đa chiều** vì mỗi tiêu chí ảnh hưởng khác nhau đến quyết định của shipper. Vựa xuất sầu riêng ưu tiên "giữ nhiệt độ" hơn "thái độ", vựa xuất thanh long ưu tiên "đúng giờ" hơn.

---

## 5. Điểm mới — AI Dynamic ETA Prediction

### 5.1. Vấn đề

Các platform hiện tại chỉ hiển thị ETA **tĩnh** từ Google Maps, không tính đến:
- Thời tiết dọc tuyến (mưa lớn làm chậm 20–30%)
- Tắc cửa khẩu (chờ 6–48 giờ tùy mùa)
- Ngày lễ VN/TQ (Tết TQ tắc cực nặng)
- Giờ trong ngày (đêm nhanh hơn ngày 15%)
- Loại xe, tuổi xe

→ ETA thủ công/Google Maps sai **2–6 giờ** là bình thường trên tuyến Đắk Lắk – Lạng Sơn (~34–40h).

### 5.2. Giải pháp

Xây dựng model **XGBoost** dự báo ETA động, cập nhật mỗi 15 phút.

**Input features (18 chiều):**
- Khoảng cách, giờ khởi hành, ngày trong tuần, tháng
- Ngày lễ VN/TQ, mùa cao điểm
- Nhiệt độ, cường độ mưa dọc tuyến
- Loại xe, tuổi xe, kinh nghiệm tài xế
- Số xe đang chờ ở cửa khẩu
- Tuyến đường cụ thể

**Output:** Thời gian dự kiến đến (giờ) + độ tin cậy

### 5.3. Nguồn data

| Nguồn | Loại data | Chi phí |
|---|---|---|
| **Google Maps Distance Matrix API** | ETA baseline giữa các cặp điểm | Free tier 40K/tháng |
| **OpenWeatherMap API** | Thời tiết lịch sử theo tọa độ | Free 1K/ngày |
| **Crawl fanpage "Cửa khẩu Lạng Sơn"** | Số xe chờ, tình trạng thông quan | Free |
| **Khảo sát tài xế** | ~30 tài xế đường dài tại bến Cát Lái, chợ Thủ Đức | Free (2 tuần) |
| **Synthetic data** | Sinh từ baseline + noise model | Free |

**Chiến lược hybrid:** 70% Google Maps + 20% khảo sát tài xế + 10% crawl → ~10.000 điểm dữ liệu.

### 5.4. Metric mục tiêu

- MAE (Mean Absolute Error): **≤ 45 phút** trên tuyến Đắk Lắk – Lạng Sơn
- So với Google Maps ETA baseline: **~4 giờ** → cải thiện ~5x

---

## 6. Cơ chế Ghép Cont dựa trên RSL

### 6.1. RSL là gì?

**RSL (Remaining Shelf Life)** = thời gian tươi còn lại của lô hàng, tính bằng ngày.

```
RSL = Tuổi thọ chuẩn của loại nông sản (ở nhiệt độ bảo quản đúng)
      - Số ngày đã trôi qua kể từ khi thu hoạch
      - Hệ số điều chỉnh theo độ chín ban đầu
```

**Ví dụ:**
- Sầu riêng Ri6 ở 15°C: tuổi thọ chuẩn = 21 ngày
- Cắt ngày 15/09, hôm nay 17/09 → đã trôi 2 ngày
- Độ chín ban đầu 70% → hệ số 0.85
- **RSL = (21 - 2) × 0.85 ≈ 16 ngày**

### 6.2. Quy tắc ghép cont dựa trên RSL

Hệ thống chỉ gợi ý ghép chung cont khi **thoả cả 4 điều kiện**:

| Điều kiện | Ngưỡng |
|---|---|
| **RSL tương đồng** | Chênh lệch RSL ≤ 3 ngày giữa các lô |
| **Tổng RSL đủ dài** | RSL của lô ngắn nhất > (thời gian ETA + buffer 2 ngày) |
| **Cùng nhiệt độ bảo quản** | Chênh lệch nhiệt độ set-point ≤ 1°C |
| **Cùng cảng/cửa khẩu đích** | Phải cùng điểm dỡ hàng cuối |

### 6.3. Thuật toán gợi ý ghép

```
Input:
  - Danh sách các lô hàng đang chờ ghép cont
  - Mỗi lô: {vựa, khối lượng, thể tích, RSL, nhiệt độ, cảng đích, deadline}
  - Danh sách cont trống sẵn có

Bước 1: Nhóm lô theo cảng đích + dải nhiệt độ (±1°C)
Bước 2: Trong mỗi nhóm, sắp xếp theo RSL giảm dần
Bước 3: Ghép các lô có RSL chênh lệch ≤ 3 ngày
Bước 4: Kiểm tra tổng thể tích ≤ 90% cont (chừa khoảng thông khí)
Bước 5: Kiểm tra RSL min > ETA + 2 ngày buffer
Bước 6: Xuất gợi ý ghép cùng thứ tự bốc dỡ (lô RSL thấp nhất bốc lên trước — dỡ sau cùng)

Output:
  - Danh sách gợi ý ghép cont tối ưu
  - Điểm số utilization: tổng thể tích ghép / thể tích cont
```

### 6.4. Ưu tiên khi bốc dỡ

Lô có **RSL thấp nhất → dỡ trước** để về tay người mua sớm nhất, giảm rủi ro mất giá.

---

## 7. Luồng nghiệp vụ (User Flow)

### 7.1. Luồng chủ vựa book cont nguyên

```
1. Đăng nhập → chọn interface "Chủ vựa"
2. Tạo booking mới:
   - Nhập thông tin lô hàng (loại, khối lượng, ngày cắt, độ chín)
   - Hệ thống tự tính RSL
   - Chọn cảng đích, deadline
3. Filter cont phù hợp:
   - Theo ngày khởi hành, giá, carrier
4. Chọn cont → xác nhận book
5. Nhận mã booking → chờ carrier xác nhận
6. Sau khi confirmed:
   - Xem phase cont real-time
   - Xem map + ETA động
   - Nhận thông báo khi có cập nhật
```

### 7.2. Luồng chủ vựa ghép cont

```
1. Tạo booking → chọn "Ghép cont"
2. Nhập thông tin lô (khối lượng, RSL, nhiệt độ, cảng đích)
3. Hệ thống tự động matching:
   - Tìm các lô khác đang chờ ghép + thoả điều kiện RSL
   - Gợi ý danh sách nhóm ghép + cont phù hợp
4. Xác nhận tham gia nhóm ghép
5. Khi đủ hàng: hệ thống notify tất cả thành viên nhóm
6. Track chung cont ghép:
   - Xem tất cả các lô trong cont
   - Xem thứ tự bốc dỡ theo RSL
```

### 7.3. Luồng bên vận chuyển

```
1. Đăng ký tài khoản → xác thực giấy phép
2. Đăng ký cont/chuyến:
   - Chọn tuyến từ template
   - Nhập số cont, tải trọng, ngày khởi hành, giá cước
3. Publish → hiện trên marketplace cho vựa xem
4. Nhận booking:
   - Confirm hoặc reject
5. Trong quá trình vận chuyển:
   - Cập nhật phase khi đến từng điểm
   - Báo sự cố nếu có (tự động notify vựa)
   - GPS tracker (mô phỏng cho demo)
6. Hoàn thành → cập nhật phase "Đã giao"
```

---

## 8. Kiến trúc kỹ thuật

### 8.1. Sơ đồ tổng thể

```
┌─────────────────┐     ┌─────────────────┐
│  Web Frontend   │     │  Web Frontend   │
│  (Chủ vựa)      │     │  (Vận chuyển)   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────┬───────────────┘
                 │
        ┌────────▼────────┐
        │  Firebase Auth  │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐  ┌────▼─────┐  ┌───▼──────┐
│Firestore│ │Cloud Fn  │  │ Mapbox   │
│(realtime)│ │(TS)      │  │  GL JS   │
└─────────┘ └────┬─────┘  └──────────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
┌─────▼───┐ ┌───▼────┐ ┌───▼──────────┐
│ETA Model│ │Consol. │ │Weather+Maps │
│(XGBoost)│ │Engine  │ │APIs          │
└─────────┘ └────────┘ └──────────────┘
```

### 8.2. Tech Stack

| Layer | Công nghệ | Lý do chọn |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind + shadcn/ui | Nhanh, SEO tốt, deploy Vercel free |
| **Map** | Mapbox GL JS | Đẹp, free tier lớn |
| **Auth** | Firebase Auth | Reuse setup từ RouteMate |
| **Realtime DB** | Firestore | Push phase update real-time cho vựa |
| **Backend Logic** | Firebase Cloud Functions (TypeScript) | Serverless, cost thấp |
| **AI ETA** | XGBoost (Python) → export ONNX → gọi qua Cloud Function | Nhẹ, deploy được |
| **Consolidation** | Thuật toán heuristic (TypeScript) chạy trực tiếp trong Cloud Function | Không cần training |
| **Fake GPS Simulator** | setInterval update Firestore mỗi 5s | Giả lập cont di chuyển cho demo |
| **Deployment** | Vercel (frontend) + Firebase (backend) | Free tier đủ cho demo |

### 8.3. Data Model (Firestore)

```
users/
  {uid}/
    - role: "shipper" | "carrier"
    - info: {...}

shipments/           // Lô hàng
  {shipmentId}/
    - shipperUid, product, weight, volume
    - harvestDate, ripeness, temperature
    - rsl (tính động)
    - destination, deadline
    - status: "pending" | "matched" | "in_transit" | "delivered"

containers/          // Container/chuyến
  {containerId}/
    - carrierUid, type (20ft/40ft), volume, capacity
    - route, departureTime, price
    - assignedShipments: [shipmentId, ...]
    - phase: "booked" | "at_warehouse" | "loading" | ...

tracking/            // Realtime location
  {containerId}/
    - lat, lng, heading, speed
    - lastUpdate
    - currentPhase
    - predictedETA

consolidationGroups/ // Nhóm ghép cont
  {groupId}/
    - shipments: [...]
    - containerId
    - matchingScore (utilization %)

ratings/             // Đánh giá dịch vụ carrier
  {ratingId}/
    - bookingId, shipperUid, carrierUid
    - overallScore (1-5)
    - criteria: {
        punctuality: 1-5,
        coldChain: 1-5,
        driverAttitude: 1-5,
        cargoCondition: 1-5
      }
    - reviewText, photos[]
    - createdAt, editableUntil
    - carrierResponse (nếu có)

carrierStats/        // Thống kê điểm carrier (denormalized)
  {carrierUid}/
    - avgOverall, totalReviews
    - avgByCriteria: {...}
    - distribution: {5star: X, 4star: Y, ...}
```

---

## 9. Metrics đánh giá dự án

| Metric | Mục tiêu |
|---|---|
| **Container Utilization** | 90–95% (baseline manual: ~70%) |
| **ETA Accuracy (MAE)** | ≤ 45 phút (baseline Google Maps: ~4h) |
| **Thời gian booking** | ≤ 2 giờ (baseline manual: 3–5 ngày) |
| **Waste giảm nhờ RSL-aware** | Giảm 30–40% lô bị mất giá do trễ |
| **Tiết kiệm chi phí SME** | 8–12% biên lợi nhuận |

---

## 10. Roadmap Vibe Code Demo (7 ngày)

| Ngày | Nhiệm vụ | Thời gian |
|---|---|---|
| **1** | Setup Next.js + shadcn/ui + Vercel deploy trống + mock data JSON | 3–4h |
| **2** | Fake login (chọn role) + 2 dashboard skeleton + navigation | 3–4h |
| **3** | Form booking + form ghép cont + list cont mock + filter | 4–5h |
| **4** | Map (Leaflet/Mapbox) + fake GPS animation + phase tracker | 5–6h |
| **5** | "AI ETA" hiển thị + "Ghép cont RSL" với loading animation + báo sự cố | 4–5h |
| **6** | **Rating system** (form đánh giá 4 tiêu chí + hiển thị badge + review list) + notification toast | 4–5h |
| **7** | Polish UI + xoá console log + build production + kịch bản demo + slide pitch | 5–6h |

**Tổng: ~28–35 giờ** — hoàn toàn khả thi part-time trong 7 ngày.

**Tech stack tối giản (vibe code):**
- Frontend: Next.js 14 + Tailwind + shadcn/ui
- Data: JSON tĩnh + localStorage (không cần Firebase nếu muốn tối giản)
- Map: Leaflet + OpenStreetMap (free, không cần key)
- Deploy: Vercel (git push → auto deploy)
- Chi phí: **0 đồng**

---

## 11. Kịch bản demo (Storyline)

> **Anh Nam** ở Krông Pắc có 4 tấn sầu Ri6 chín trong 5 ngày. Vựa quá nhỏ để book cont nguyên.
>
> Anh mở SmartCont → nhập lô hàng → hệ thống tự tính **RSL = 16 ngày**.
>
> AI gợi ý ghép với **anh Bình** (3 tấn, RSL 14 ngày) + **chị Lan** (5 tấn, RSL 17 ngày) — cả 3 đều xuất Bằng Tường, cùng nhiệt độ 15°C.
>
> Cont utilization đạt **93%** (12/13 tấn tải trọng).
>
> Xe khởi hành từ Đắk Lắk lúc 20:00. AI ETA dự báo đến cửa khẩu Hữu Nghị sau **43h ±30 phút** (đã tính thời tiết + tắc cửa khẩu).
>
> Sau 12h di chuyển, hệ thống phát hiện mưa lớn ở Hà Tĩnh → **ETA cập nhật thành 46h**. Cả 3 vựa nhận thông báo Zalo.
>
> Cont đến cửa khẩu → phase tự động chuyển "Thông quan" → 8h sau qua biên giới → giao tại Bằng Tường.
>
> Anh Nam nhận thanh toán ngay khi giao thành công.

---

## 12. Điểm khác biệt so với đối thủ

| Đối thủ | Phục vụ ai | SmartCont khác thế nào |
|---|---|---|
| **Maersk Captain Peter** | Enterprise, cont nguyên FCL | Ta phục vụ SME + có ghép cont |
| **Phaata.com** | Forwarder, cước biển | Ta focus corridor nội địa + tiểu ngạch |
| **project44 / GoComet** | Global visibility platform | Ta có RSL-aware consolidation |
| **Zalo/gọi điện thủ công** | SME hiện tại | Ta có AI ETA + auto matching |

**USP:** *Nền tảng duy nhất kết hợp **ghép cont theo RSL** + **AI dự báo ETA động** + **rating đa chiều cho logistics B2B** cho SME nông sản xuất tiểu ngạch.*

---

## 13. Giới hạn & Roadmap V2

**Giới hạn V1 (demo):**
- Fake GPS (chưa tích hợp GPS thật)
- Data ETA training từ synthetic + Google Maps (chưa có data forwarder thật)
- Chưa có module chứng từ (C/O form E, kiểm dịch)
- Chưa có payment gateway thật
- Chưa xử lý tranh chấp khi hỏng hàng ghép cont

**V2 roadmap:**
- Module chứng từ tự động theo Nghị định thư VN-TQ 2022
- Tích hợp IoT sensor nhiệt độ + ethylene
- Smart contract phân bổ trách nhiệm khi hỏng hàng
- Mở rộng sang thanh long, xoài, chôm chôm
- Kết nối API hãng tàu (Maersk, ONE) cho xuất chính ngạch

---

## 14. Chiến lược triển khai — Vibe Code cho Demo

### 14.1. Mục tiêu thực tế của bản demo

Bản web này được xây với mục đích **duy nhất**:

1. ✅ **Thuyết trình trên slide** — người thuyết trình share màn hình, walkthrough từng tính năng
2. ✅ **Người xem tự vào web click thử** — trải nghiệm các tính năng, cảm nhận được flow
3. ❌ **KHÔNG phải sản phẩm production** — không cần accuracy AI thật, không cần data thật, không cần scale

→ Đây là **prototype có thể tương tác**, không phải MVP hoàn chỉnh.

### 14.2. Nguyên tắc vibe code

- **Frontend-first, backend tối thiểu**: chủ yếu React state + localStorage/Firebase free
- **Mock data JSON tĩnh**: 10–15 mẫu cont, vựa, booking, review cho từng loại
- **"AI" là function heuristic**: ETA = base_hours + rules + random noise; ghép cont = filter theo RSL
- **Không train ML thật**: bỏ qua toàn bộ pipeline XGBoost, dùng công thức đơn giản trong TypeScript
- **Realtime = setInterval**: fake GPS di chuyển, ETA cập nhật động, notification pop-up
- **Deploy free tier**: Vercel + Firebase free là đủ, tổng chi phí 0 đồng
- **Timeline**: 7 ngày, ~25–30 giờ làm việc

### 14.3. Nguyên tắc "fake không bị lộ"

Người xem (giám khảo, khán giả, người click thử) phải **không phân biệt được** với sản phẩm thật. Các quy tắc bắt buộc:

| Rủi ro lộ | Cách bịt |
|---|---|
| Data mất khi F5 | Persist qua **localStorage** hoặc **Firebase Firestore free** |
| "AI" trả kết quả tức thì | Thêm **loading animation 1.5–3s** với status text: "Đang phân tích 247 lô hàng...", "Tính RSL compatibility...", "Tối ưu utilization..." |
| ETA số tròn quá | Format có phút lẻ: **"43 giờ 27 phút ±32 phút"** + **confidence score 87%** |
| ETA không đổi | **setInterval mỗi 30s** cho ETA lệch ±1–2 phút → trông như model đang tính lại |
| GPS đi xuyên núi/hồ | Lấy polyline thật từ **OSRM/Mapbox Directions API** → interpolate marker dọc theo đường thật |
| Form nhập bậy vẫn OK | Validation cơ bản bằng **zod + react-hook-form** (required, số dương, ngày tương lai) |
| Chỉ 1 kịch bản chạy được | Chuẩn bị **5–10 kịch bản mock đa dạng** + hàm ghép cont **generic** |
| Console log lộ "hardcoded", "TODO" | **Xoá hết log** + build production mode (`npm run build`) |
| Cảm giác web tĩnh, đơ | Thêm **toast notifications**, **badge số đếm động**, **animation phase progress** |
| Empty state / error state xấu | Design tử tế: illustration + hướng dẫn khi chưa có data |
| Số liệu dashboard fake lộ liễu | Con số có vẻ thật: **"127 cont đã ghép", "utilization TB 89.3%", "Tổng SME tham gia: 43"** |

### 14.4. Checklist trước khi demo

- [ ] Data persist qua reload
- [ ] Mọi action AI có loading animation + status text
- [ ] ETA có phút lẻ, cập nhật động, có confidence
- [ ] Marker GPS đi theo polyline thật, tốc độ hợp lý (60–80 km/h)
- [ ] Form có validation (required, range, date)
- [ ] 5+ kịch bản mock data đa dạng
- [ ] Rating có phân bố sao đa dạng (không phải toàn 5 sao)
- [ ] Review text có nội dung thật, đa dạng giọng điệu
- [ ] Xoá console.log, build production
- [ ] Toast notifications cho events chính
- [ ] Empty state, error state đẹp
- [ ] Loading skeleton cho lần đầu load
- [ ] Test thử trên incognito browser (đảm bảo không phụ thuộc cache)
- [ ] Test trên điện thoại (giám khảo có thể quét QR vào bằng mobile)

### 14.5. Kịch bản trả lời Q&A khi bị hỏi kỹ

**Q: "Model AI ETA của em train trên bao nhiêu data?"**
> Bản demo hôm nay là **UX prototype** để minh hoạ concept và trải nghiệm người dùng. Backend AI đã có pipeline thiết kế sẵn (XGBoost, 18 features, data hybrid từ Google Maps API + khảo sát tài xế + crawl fanpage cửa khẩu). Việc thu data thật cần 2–3 tuần trước khi deploy production. Em xin phép present roadmap kỹ thuật trong slide sau.

**Q: "Ghép cont chạy thuật toán gì?"**
> Phiên bản demo dùng **rule-based 4 điều kiện** (RSL chênh lệch ≤ 3 ngày, nhiệt độ ≤ 1°C, cùng cảng đích, tổng thể tích ≤ 90% cont). Phiên bản V2 sẽ nâng cấp lên **Genetic Algorithm** để tối ưu đa mục tiêu (thể tích × RSL × chi phí gom hàng).

**Q: "Cho xem code AI chạy được không?"**
> Dạ hôm nay em demo phần trải nghiệm người dùng. Code AI model đang ở repository riêng, em có thể share sau qua email/GitHub. Kiến trúc kỹ thuật ở slide 15 mô tả pipeline đầy đủ.

**Q: "Data lấy ở đâu?"**
> Chiến lược data đã document rõ trong tài liệu: **Google Maps API** cho ETA baseline, **OpenWeatherMap** cho thời tiết, **khảo sát 30 tài xế** tại bến Cát Lái và chợ Thủ Đức, **crawl fanpage "Cửa khẩu Lạng Sơn"** cho tình trạng thông quan. Demo hiện tại dùng mock data để minh hoạ.

**Nguyên tắc trả lời:** **Thành thật là "demo UX", nhưng luôn kèm roadmap kỹ thuật có sẵn** → giám khảo thấy nhóm có kế hoạch nghiêm túc, không cảm giác "vibe code cho có".

### 14.6. Điểm cần né trong pitch

- ❌ **KHÔNG nói:** "AI của em đã train xong với accuracy 95%" → nếu bị soi là bể
- ❌ **KHÔNG nói:** "Đây là sản phẩm hoàn chỉnh sẵn sàng bán" → over-promise
- ❌ **KHÔNG nói:** "Chưa có ai làm cái này" → dễ bị bác bởi Maersk/Phaata
- ✅ **NÊN nói:** "Prototype thể hiện concept + UX cho SME nông sản, roadmap kỹ thuật đã sẵn sàng"
- ✅ **NÊN nói:** "Ngách blue ocean: SME xuất tiểu ngạch — segment các platform lớn bỏ quên"
- ✅ **NÊN nói:** "USP là combination: RSL-based consolidation + Dynamic ETA + Rating đa chiều cho logistics B2B"

### 14.7. Định hướng giao diện — Kết hợp Công nghệ × Logistics

Giao diện phải cân bằng **2 chất** rõ rệt, tránh nghiêng hẳn về một bên:

**Chất công nghệ (Tech feel):**
- Dashboard style hiện đại với **card, chart, badge, metric**
- **Dark mode** hoặc palette xanh-tím (giống Linear, Vercel, Notion)
- **Micro-animation**: skeleton loading, smooth transition, hover effect
- **Data visualization**: biểu đồ đường ETA, phân bố rating, gauge chart utilization
- **Real-time indicator**: chấm xanh nhấp nháy "Live", timer đếm ngược
- **Typography sạch**: Inter, Geist, SF Pro — không dùng Times/Arial
- **Icon set nhất quán**: Lucide, Heroicons

**Chất logistics (Industry feel):**
- **Thuật ngữ ngành chuẩn**: RSL, FCL/LCL, reefer, set-point, dwell time, utilization
- **Ký hiệu container**: hình cont 20ft/40ft có kích thước, số hiệu (VD: `MSKU 1234567`)
- **Bản đồ tuyến vận tải**: có cửa khẩu, cảng, depot đánh dấu bằng icon riêng
- **Timeline phase kiểu shipping**: milestone tracking (Gate In → Load → Sail → Discharge → Gate Out)
- **Bảng thông tin cont chuyên nghiệp**: nhiệt độ set-point, humidity, ethylene level
- **Bill of Lading / Booking Confirmation mockup**: dạng chứng từ shipping thật
- **Màu warning theo tiêu chuẩn cold chain**: xanh (an toàn), vàng (cảnh báo), đỏ (vi phạm nhiệt độ)
- **Đơn vị chuẩn ngành**: TEU, m³, kg, °C, nautical miles nếu có

**Cân bằng bố cục:**

| Vùng | Chất trội |
|---|---|
| **Landing page** | 70% Tech (hero animation, gradient, CTA hiện đại) + 30% Logistics (hình cont, tuyến biển) |
| **Dashboard tổng** | 60% Tech (charts, cards, metrics) + 40% Logistics (thuật ngữ, KPI ngành) |
| **Chi tiết cont/booking** | 40% Tech (UI card, timeline animation) + 60% Logistics (thông số kỹ thuật, chứng từ) |
| **Map view** | 50/50 (map hiện đại + icon cảng/cửa khẩu/xe cont chuyên ngành) |
| **Rating & Review** | 70% Tech (star animation, chart phân bố) + 30% Logistics (4 tiêu chí ngành) |

**Nguyên tắc kiểm tra nhanh:**
> Người xem lần đầu phải cảm nhận: *"Đây là một **web app hiện đại** dành cho **ngành logistics chuyên nghiệp**"* — không phải "app giao đồ ăn dán mác cont" cũng không phải "excel sheet cũ kỹ của forwarder truyền thống".

**Nguồn cảm hứng tham khảo:**
- Tech vibe: Linear.app, Vercel Dashboard, Retool
- Logistics vibe: Flexport.com, project44.com, GoComet.com, Maersk MyFinance dashboard
- Kết hợp tốt: **Flexport dashboard** — vừa modern vừa "đậm chất shipping"

---

## 15. Tài liệu tham khảo

- FAO Postharvest Handbook — nhiệt độ & shelf-life nông sản
- USDA Handbook 66 — cold chain compatibility chart
- SOFRI (Viện Cây ăn quả Miền Nam) — dữ liệu sầu riêng VN
- Nghị định thư VN-TQ 2022 về xuất khẩu sầu riêng chính ngạch
- Báo cáo VLA (Hiệp hội Logistics VN) 2024

---

*Tài liệu bản 1.0 — chuẩn bị cho cuộc thi chuyên ngành Logistics.*
