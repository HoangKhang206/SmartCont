# SmartCont — Claude CLI Context

> **Đọc file này TRƯỚC KHI làm bất kỳ task nào.** Sau đó tham khảo `docs/` cho chi tiết.

---

## 1. Dự án là gì

**SmartCont** — web app demo cho cuộc thi chuyên ngành Logistics tại HCMUS.

Nền tảng booking + ghép container lạnh cho SME nông sản (sầu riêng, xoài, thanh long) xuất tiểu ngạch qua cửa khẩu Lạng Sơn.

**3 tính năng lõi:**
1. Book cont / Ghép cont dựa trên **RSL (Remaining Shelf Life)**
2. AI **Dynamic ETA Prediction** (fake bằng heuristic function)
3. **Rating 4 tiêu chí** cho carrier

**2 role:**
- **Shipper** (chủ vựa): `/shipper/*`
- **Carrier** (bên vận chuyển): `/carrier/*`

Chi tiết đầy đủ: `docs/project-spec.md`.

---

## 2. Mindset: VIBE CODE DEMO — không phải production

- **Mục tiêu:** web để thuyết trình + người xem click thử → cảm nhận flow, KHÔNG cần logic đúng.
- **AI = function heuristic** trong `lib/fake-ai.ts`, không train model thật.
- **Data = JSON tĩnh** trong `data/`, không dùng database thật.
- **Realtime = setInterval** cập nhật React state.
- **Auth = fake login** (chọn role rồi vào), không xác thực thật.

**NGUYÊN TẮC BẮT BUỘC: Fake không được lộ.** Đọc `docs/anti-detection-rules.md`.

---

## 3. Tech stack

| Layer | Công nghệ |
|---|---|
| Framework | **Next.js 14 App Router** + TypeScript |
| Styling | **Tailwind CSS** + **shadcn/ui** |
| Map | **Leaflet** + **react-leaflet** + OpenStreetMap tiles (free, không cần key) |
| Icons | **lucide-react** |
| Forms | **react-hook-form** + **zod** validation |
| Toast | **sonner** |
| Charts | **recharts** |
| Date | **date-fns** |
| State | React `useState` + `useReducer` + **localStorage** persist |
| Deploy | **Vercel** |

**KHÔNG dùng:** Firebase, Supabase, Prisma, backend riêng, TanStack Query, Redux, Zustand. Giữ đơn giản.

---

## 4. Coding conventions

### File & folder
- Component: **PascalCase** (`ContainerCard.tsx`)
- Utility/hook: **camelCase** (`fakeEta.ts`, `useContainerData.ts`)
- Page: `page.tsx` trong folder theo route
- Layout: `layout.tsx`
- Server Component **mặc định**, chỉ dùng `"use client"` khi cần state/interaction
- Import với alias `@/*` (đã config trong `tsconfig.json`)

### TypeScript
- **KHÔNG dùng `any`**, dùng type từ `lib/types.ts`
- Component props: `interface ComponentNameProps { ... }`
- Export type từ `lib/types.ts`, import khi cần

### Styling
- Chỉ dùng **Tailwind utility classes**, không viết CSS module
- Đọc `docs/ui-design-guide.md` cho palette + typography
- Dùng CSS variables đã setup trong `app/globals.css` (đừng hardcode màu)
- Responsive: mobile-first, breakpoint `md:` cho desktop

### UI patterns
- Loading: skeleton từ shadcn hoặc custom shimmer, KHÔNG dùng spinner đơn thuần
- Empty state: illustration + call-to-action
- Error: message rõ ràng + hướng dẫn khắc phục
- Toast (sonner): thành công dùng màu emerald, lỗi dùng rose
- Số liệu: format bằng `Intl.NumberFormat('vi-VN')`
- Ngày: format bằng `date-fns` với `locale: vi`

---

## 5. Ngôn ngữ UI

**Tiếng Việt** cho toàn bộ UI. Thuật ngữ logistics giữ nguyên tiếng Anh khi phổ biến hơn:
- ✅ Container, FCL, LCL, ETA, RSL, reefer, cold chain, cont (nói tắt)
- ✅ Booking, phase, tracking, carrier, shipper (khi nói về role)
- ❌ KHÔNG dịch "container" thành "thùng chứa"

Ví dụ:
- "Tạo booking mới" ✓
- "Nhiệt độ set-point: 15°C" ✓
- "ETA dự kiến: 43h 27p" ✓
- "Tìm cont phù hợp" ✓

---

## 6. Design vibe: Công nghệ × Logistics

**Không phải app giao đồ ăn.** Không phải Excel forwarder truyền thống.

Là **web app hiện đại cho ngành logistics chuyên nghiệp** — giống Flexport, project44, GoComet.

- Palette: cool tones (evoke cold chain) + accent electric cho tech feel
- Typography: Geist Sans (một họ, weight rõ ràng)
- Layout: dashboard style với card, metric, chart
- Terminology: đầy đủ thuật ngữ ngành
- Animation: micro-interaction, KHÔNG lạm dụng

Chi tiết: `docs/ui-design-guide.md`.

---

## 7. Fake không lộ — Quy tắc bắt buộc

Mỗi lần code tính năng có "AI" hoặc "realtime", nhớ:

1. **Loading animation** 1.5–3s với status text đa dạng ("Đang phân tích 247 lô hàng...", "Tính RSL compatibility...")
2. **ETA** phải có phút lẻ + confidence score, cập nhật động qua interval
3. **GPS** đi theo polyline thật (dùng OSRM API hoặc route có sẵn trong `data/routes.json`)
4. **Form** phải có validation zod (required, số dương, ngày tương lai)
5. **Data** persist qua localStorage, KHÔNG mất khi F5
6. **Số liệu dashboard** có vẻ thật: "127 cont đã ghép", "utilization TB 89.3%"
7. **Console.log** phải sạch trước demo — dùng `logger.ts` với env check

Đọc `docs/anti-detection-rules.md` để tra chi tiết.

---

## 8. Data flow

```
JSON tĩnh (data/*.json)
        ↓
lib/data-store.ts (đọc + persist localStorage)
        ↓
React Component (useState/useEffect)
        ↓
UI hiển thị + user tương tác
        ↓
Cập nhật localStorage
```

**KHÔNG có backend, KHÔNG có API route thật** (trừ vài mock trong `app/api/` để giả lập AI processing với delay).

---

## 9. Kịch bản demo phải luôn chạy

5 kịch bản trong `docs/demo-scenarios.md` PHẢI luôn hoạt động end-to-end:
1. **Anh Nam ghép cont sầu riêng** (main storyline)
2. Chị Lan book cont nguyên
3. Anh Tuấn (carrier) publish chuyến
4. Sự cố nhiệt độ giữa đường
5. Rating sau khi hoàn thành

**Trước mỗi commit lớn: test lại 5 kịch bản này.**

---

## 10. Khi nhận task từ user

1. **Đọc kỹ task** — có phải là tính năng trong roadmap không? (xem `docs/component-list.md`)
2. **Check dependencies** — component cần dùng cái nào đã build? Đọc trước.
3. **Đọc docs liên quan** — spec, design guide, anti-detection.
4. **Code theo convention** — không tự đổi stack/pattern.
5. **Test scenario** — kịch bản demo có ảnh hưởng không?
6. **Báo cáo ngắn gọn** — file đã tạo/sửa, cần user làm gì tiếp.

---

## 11. Danh sách docs

| File | Nội dung |
|---|---|
| `docs/project-spec.md` | Spec đầy đủ dự án (từ tài liệu gốc) |
| `docs/ui-design-guide.md` | Palette, typography, spacing, tone |
| `docs/component-list.md` | Danh sách component + thứ tự build |
| `docs/demo-scenarios.md` | 5 kịch bản demo phải luôn chạy |
| `docs/anti-detection-rules.md` | Chi tiết cách fake không bị lộ |
| `docs/data-schema.md` | Cấu trúc mock data JSON |
| `docs/prompt-templates.md` | Template prompt để user prompt Claude CLI |

---

## 12. Điều cấm

- ❌ Thêm dependency lạ ngoài stack ở mục 3 (không tự cài Firebase, Prisma, tRPC...)
- ❌ Viết CSS module hay styled-components (chỉ Tailwind)
- ❌ Dùng `any` trong TypeScript
- ❌ Hardcode màu (dùng CSS variables trong `globals.css`)
- ❌ Bỏ qua loading state cho action "AI"
- ❌ Console.log rác trong code production
- ❌ Data không persist qua reload
- ❌ Số liệu dashboard tròn trịa (100, 500, 1000 → lộ liễu)
- ❌ Comment "TODO", "FAKE", "HARDCODED" trong code (giám khảo có thể mở DevTools)

---

**Sẵn sàng vibe code. Chúc thành công 🚀**
