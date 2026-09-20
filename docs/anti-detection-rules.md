# SmartCont — Anti-Detection Rules

> Web là fake. Người xem không được biết. Áp dụng TẤT CẢ quy tắc dưới.

## Quy tắc số 1: Data phải persist qua reload

**Vấn đề:** User F5 → data mất → biết fake.

**Giải pháp:** MỌI thay đổi (create, update, delete) phải:
1. Update React state cho UI phản hồi ngay
2. Ghi vào localStorage qua `data-store.ts`

Mẫu code chuẩn:
```typescript
import { saveShipment, getShipments } from "@/lib/data-store"

async function handleCreateShipment(data: ShipmentFormData) {
  const newShipment: Shipment = {
    id: generateId("ship"),
    ...data,
    rsl: calculateRSL(data.productType, data.harvestDate, data.ripenessPercent),
    createdAt: new Date().toISOString(),
    status: "pending_match",
  }

  saveShipment(newShipment) // persist localStorage
  setShipments(prev => [...prev, newShipment]) // update UI
  toast.success("Đã tạo lô hàng", { description: `Mã: ${newShipment.id}` })
}
```

## Quy tắc số 2: AI action phải có loading steps

**Vấn đề:** Bấm "Tìm ghép cont" → 0.1s ra kết quả → lộ ngay.

**Giải pháp:** Dùng `LoadingSteps` component với status text đa dạng, tổng thời gian 1.5-3s.

Mẫu code chuẩn:
```typescript
const [loading, setLoading] = useState(false)
const [status, setStatus] = useState("")

async function handleFindConsolidation() {
  setLoading(true)
  const results = await suggestConsolidation(
    newShipment,
    pool,
    containers,
    (step) => setStatus(step) // callback nhận status từ fake-ai
  )
  setLoading(false)
  setResults(results)
}
```

**Status text mẫu (đa dạng, không lặp):**
- "Đang phân tích 247 lô hàng phù hợp..."
- "Tính điểm tương thích RSL..."
- "Kiểm tra ràng buộc nhiệt độ và cảng đích..."
- "Tối ưu container utilization..."
- "Đang chấm điểm 12 phương án..."
- "Cross-check với lịch cửa khẩu..."
- "Tính chi phí gom hàng..."

## Quy tắc số 3: Số liệu phải có vẻ thật

**Vấn đề:** "100 cont đã ghép", "500 khách hàng" → tròn quá → lộ.

**Giải pháp:** Số phải **có lẻ**, **không round**:

| ❌ Lộ | ✅ Thật |
|---|---|
| 100 cont | 127 cont |
| 500 khách hàng | 483 khách hàng |
| 90% utilization | 89.3% utilization |
| ETA: 43 giờ | ETA: 43h 27p ±32p |
| Rating: 5.0 | Rating: 4.7 (28 reviews) |
| Success: 100% | On-time: 94.2% |

## Quy tắc số 4: ETA phải động

**Vấn đề:** ETA đứng yên → biết là hardcode.

**Giải pháp:** Setup interval update mỗi 30s cho ETA lệch ±1-2 phút.

Mẫu code:
```typescript
useEffect(() => {
  if (!container || container.currentPhase === "delivered") return

  const interval = setInterval(() => {
    setEta((prev) => updateETA(prev))
  }, 30000) // 30s

  return () => clearInterval(interval)
}, [container])
```

Kèm indicator "Cập nhật lần cuối: X giây trước".

## Quy tắc số 5: GPS đi theo polyline thật

**Vấn đề:** Marker đi thẳng qua rừng/hồ → lộ.

**Giải pháp:** Dùng waypoints trong `data/routes.json` (đã prepare sẵn) + `interpolateAlongRoute()` từ `lib/fake-gps.ts`.

Tốc độ cont: **60-80 km/h** (realistic).

## Quy tắc số 6: Form phải validate

**Vấn đề:** Nhập -5 tấn vẫn submit → lộ chưa xong.

**Giải pháp:** dùng `zod` + `react-hook-form`.

Mẫu schema:
```typescript
import { z } from "zod"

const shipmentSchema = z.object({
  productType: z.enum([...]),
  weightKg: z.number().positive("Khối lượng phải lớn hơn 0").max(30000),
  volumeM3: z.number().positive().max(70),
  harvestDate: z.string().refine(v => new Date(v) <= new Date(), "Ngày cắt không được ở tương lai"),
  deadlineDate: z.string().refine(v => new Date(v) > new Date(), "Deadline phải ở tương lai"),
  ripenessPercent: z.number().min(0).max(100),
  temperatureRequiredC: z.number().min(-30).max(30),
})
```

## Quy tắc số 7: Empty state & error state phải đẹp

**Vấn đề:** Trang trống toác khi chưa có data → lộ "chưa xong".

**Giải pháp:** MỌI list phải có:
- Loading skeleton (khi đang load lần đầu)
- Empty state (khi list rỗng): icon + text + CTA
- Error state (khi có lỗi): message rõ + nút "Thử lại"

## Quy tắc số 8: Console phải sạch

**Trước khi demo:**

1. Grep code tìm `console.log`, `console.warn`, `console.error` → xoá hoặc thay bằng logger.
2. Xoá comment "TODO", "FIXME", "FAKE", "HARDCODED", "MOCK".
3. Build production: `npm run build && npm start` (minified, khó đọc).
4. Đổi tên biến "lộ": `hardcodedResults` → `matchingResults`, `fakeETA` → `predictedETA`.

Mẫu logger có env check:
```typescript
// lib/logger.ts
export const log = {
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.log(...args)
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.error(...args)
  },
}
```

## Quy tắc số 9: Rating fake nhưng đa dạng

**Vấn đề:** Tất cả review đều 5 sao "quá tốt" → lộ.

**Giải pháp:** Phân bố ratings tự nhiên:
- 60% 5 sao
- 25% 4 sao
- 10% 3 sao
- 4% 2 sao
- 1% 1 sao

Review text đa dạng: có khen, có chê, có phản hồi từ carrier. **Đã prepare sẵn trong `data/ratings.json`.**

## Quy tắc số 10: Toast notification cho mọi event

Mỗi action phải có feedback:
- Tạo booking → `toast.success("Đã tạo booking", { description: "Mã: BK-4823" })`
- Cont sang phase mới → `toast.info("Cont đã đến vựa", { description: "MSKU 7823451 đến lúc 14:32" })`
- Có sự cố → `toast.warning("Sự cố nhiệt độ", { description: "Cont TRIU 1122334 - nhiệt độ 18°C" })`
- Nhận rating mới → `toast.success("Bạn nhận được đánh giá mới")`

## Quy tắc số 11: Live indicator ở khắp nơi

- Chấm xanh nhấp nháy "Live" trên tracking page
- "Cập nhật lần cuối: X giây trước" trên ETA card
- Badge số notification chưa đọc (thay đổi qua thời gian)
- Fake incoming notification mỗi 60-90s trong background

## Quy tắc số 12: Không lộ trong DevTools

Nếu giám khảo mở F12:
- Network tab: không có API call thật (chỉ static assets)
- Console: sạch
- Application → Local Storage: có `smartcont:*` keys với data hợp lý → **trông giống có backend**
- React DevTools: components có tên đúng semantic (không `TempComponent`, `Test1`)

## Checklist trước demo (BẮT BUỘC)

- [ ] Grep `console.log|console.warn|console.error` — clean
- [ ] Grep `TODO|FIXME|FAKE|MOCK|HARDCODED` — clean hoặc rename
- [ ] Build production: `npm run build` không lỗi
- [ ] Reset demo data → click qua 5 kịch bản đầy đủ
- [ ] Test trên incognito browser (đảm bảo không phụ thuộc cache dev)
- [ ] Test trên mobile browser (giám khảo có thể quét QR)
- [ ] Verify: F5 giữ nguyên data
- [ ] Verify: mọi AI action có loading steps
- [ ] Verify: ETA cập nhật động
- [ ] Verify: toast pop up cho mọi action
- [ ] Prepare answers cho các câu Q&A khó (xem `project-spec.md` mục 14.5)

---

**Nguyên tắc vàng:**
> Fake không phải là lừa. Fake là **thay thế backend chưa build** bằng logic client-side sao cho **trải nghiệm người dùng giống hệt sản phẩm thật**. Miễn là trung thực khi được hỏi ("đây là UX prototype"), thì đây là cách vibe code hiệu quả nhất cho demo cuộc thi.
