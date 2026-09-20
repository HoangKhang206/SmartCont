# SmartCont — UI Design Guide

> Đọc file này TRƯỚC khi code bất kỳ component nào.

## 1. Design Principle: Công nghệ × Logistics

Web app phải cân bằng 2 chất:

- **Tech feel** (hiện đại): card, chart, dark-ready, micro-animation, Geist typography
- **Logistics feel** (chuyên ngành): thuật ngữ đầy đủ, ký hiệu cont chuẩn ISO, timeline shipping, đơn vị đúng

**Nguồn cảm hứng chính:** Flexport dashboard, project44, Linear.app.

**Không được:** giao diện Grab/Ahamove (quá casual), giao diện admin Bootstrap cũ (quá enterprise cứng).

---

## 2. Color Palette (đã setup trong `globals.css`)

Dùng CSS variable qua Tailwind, KHÔNG hardcode hex.

### Tokens

| Token | Semantic | Dùng cho |
|---|---|---|
| `bg-background` | Nền chính | body, page |
| `bg-card` | Nền card | Card, dialog |
| `text-foreground` | Text chính | Heading, body |
| `text-muted-foreground` | Text phụ | Label, caption |
| `bg-primary` | Deep slate | Button chính, header |
| `bg-accent` | Electric cyan | CTA nổi bật, active state |
| `bg-cold` | Ice blue | Reefer indicator, cold chain |
| `bg-cold-soft` | Cold background | Alert lạnh, tag |
| `bg-warm` | Amber | Warning nhiệt độ tăng |
| `bg-warning` | Amber | Delay, chú ý |
| `bg-success` | Emerald | On-time, delivered |
| `bg-danger` | Rose | Critical incident, quá hạn |

### Rules
- **Đừng dùng gradient** trừ khi thật cần (hero landing OK, dashboard KHÔNG)
- **Border-radius**: `rounded-lg` (8px) mặc định, `rounded-md` cho input, `rounded-full` cho badge/avatar
- **Shadow**: gần như không dùng — chỉ `shadow-sm` cho card nếu cần tách khỏi background
- **Elevated card**: dùng `border` + subtle bg thay vì shadow lớn

---

## 3. Typography

**Font:** Geist Sans (đã import qua `next/font`).

### Type scale

| Class | Size | Weight | Dùng cho |
|---|---|---|---|
| `text-4xl font-semibold tracking-tight` | 36px | 600 | Hero heading |
| `text-3xl font-semibold tracking-tight` | 30px | 600 | Page title |
| `text-2xl font-semibold` | 24px | 600 | Section heading |
| `text-xl font-medium` | 20px | 500 | Card heading |
| `text-lg font-medium` | 18px | 500 | Sub-heading |
| `text-base` | 16px | 400 | Body text |
| `text-sm` | 14px | 400 | Secondary text, label |
| `text-xs` | 12px | 500 | Caption, badge |
| `font-mono` | — | — | Container ID, số đo, coordinates |

### Rules
- **Line length ≤ 80 ký tự** cho body text
- **Số liệu** luôn dùng `tabular-nums` để cột thẳng hàng
- **Container ID** luôn dùng `font-mono`: `MSKU 7823451`
- **KHÔNG dùng ALL CAPS** cho label
- **KHÔNG accent một từ** trong heading (bold/color/italic một từ)
- Weight rõ ràng: dùng 400, 500, 600, 700 — bỏ qua 300 và 800

---

## 4. Spacing

Dùng scale Tailwind mặc định (4px base).

| Context | Spacing |
|---|---|
| Padding card | `p-6` (24px) |
| Padding form | `p-4` hoặc `p-6` |
| Gap giữa section | `space-y-8` hoặc `space-y-12` |
| Gap giữa card trong grid | `gap-4` hoặc `gap-6` |
| Gap trong form | `space-y-4` |
| Padding button | `px-4 py-2` (sm), `px-6 py-3` (default) |

---

## 5. Layout Patterns

### Dashboard (Shipper/Carrier)

```
┌─────────────────────────────────────┐
│ TopBar (logo + role switch + user)  │
├──────┬──────────────────────────────┤
│      │                              │
│ Nav  │  Main Content                │
│ Side │  - Page title                │
│      │  - Metric cards row (4 cols) │
│      │  - Chart / Table             │
│      │                              │
└──────┴──────────────────────────────┘
```

- **Sidebar**: `w-64`, `border-r`, sticky
- **Main**: max-width `max-w-7xl mx-auto`, `p-8`
- **Mobile**: sidebar collapse thành drawer với hamburger

### Metric Card

```tsx
<Card className="p-6">
  <p className="text-sm text-muted-foreground">Container Utilization</p>
  <p className="text-3xl font-semibold tabular-nums">89.3%</p>
  <p className="text-xs text-success flex items-center gap-1">
    <TrendingUp className="h-3 w-3" />
    +12% so với tháng trước
  </p>
</Card>
```

### Container Card (list item)

```
┌─────────────────────────────────────────┐
│ ● Live   MSKU 7823451   [Reefer 40HC]  │
│                                         │
│ Krông Pắc → Hữu Nghị                    │
│ Khởi hành: 22:00, 22/09/2026            │
│                                         │
│ ETA: 43 giờ 27 phút ±32p (87%)          │
│                                         │
│ 15°C  •  67 m³  •  ⭐ 4.8 (24)          │
│                                         │
│ [Xem chi tiết]  [Book cont]             │
└─────────────────────────────────────────┘
```

---

## 6. Component Patterns

### Loading State (BẮT BUỘC cho AI actions)

Đừng dùng spinner chung chung. Dùng **status text đa dạng**:

```tsx
const [status, setStatus] = useState("")

async function handleAiAction() {
  setStatus("Đang phân tích 247 lô hàng phù hợp...")
  await sleep(1200)
  setStatus("Tính điểm tương thích RSL...")
  await sleep(800)
  setStatus("Tối ưu utilization container...")
  await sleep(600)
  // ...
}
```

Kèm skeleton hoặc pulse animation.

### Empty State

- Icon lucide phù hợp
- Heading ngắn
- Text mô tả 1-2 câu
- CTA button

### Error State

- Icon `AlertCircle`
- Heading: nói cụ thể lỗi gì
- Hướng dẫn khắc phục
- CTA "Thử lại" hoặc "Về trang chủ"

### Toast (sonner)

```tsx
import { toast } from "sonner"

toast.success("Đã tạo booking", { description: "Mã: BK-4823. Carrier sẽ xác nhận trong 15 phút." })
toast.error("Không tìm thấy cont phù hợp", { description: "Hãy nới lỏng filter." })
toast.info("Cont đã đến vựa", { description: "MSKU 7823451 đến lúc 14:32." })
```

---

## 7. Iconography

**Chỉ dùng `lucide-react`.**

| Concept | Icon |
|---|---|
| Container | `Container`, `Package` |
| Truck/Delivery | `Truck` |
| Route/Map | `Map`, `MapPin`, `Navigation` |
| Temperature | `Thermometer`, `Snowflake` |
| Time/ETA | `Clock`, `Timer` |
| Rating | `Star`, `StarHalf` |
| Warning | `AlertTriangle`, `AlertCircle` |
| Success | `CheckCircle2` |
| Cold | `Snowflake` |
| Documentation | `FileText`, `ClipboardList` |
| Shipper role | `Warehouse`, `Package` |
| Carrier role | `Truck` |
| Border | `Flag`, `MapPin` |

Kích thước mặc định: `h-4 w-4` inline, `h-5 w-5` button, `h-6 w-6` icon lớn.

---

## 8. Chart Guidelines

Dùng `recharts`. Style theo palette.

- Line chart: `stroke="hsl(var(--accent))"` cho line chính
- Bar chart: `fill="hsl(var(--primary))"` mặc định
- Trục: `stroke="hsl(var(--muted-foreground))"`, `fontSize: 12`
- Tooltip: custom với `Card` background
- Không dùng background gradient trong chart

---

## 9. Map (Leaflet)

- Tile: OpenStreetMap `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Marker cont: custom SVG icon (icon `Truck` màu accent)
- Polyline route: `color="hsl(var(--accent))"`, `weight: 4`, `opacity: 0.8`
- Border markers: icon `Flag` màu warning
- Vựa markers: icon `Warehouse` màu primary

**Không dùng Google Maps** (cần API key có phí ở scale demo).

---

## 10. Writing / Copy

### Tone
- Chuyên nghiệp nhưng dễ hiểu, không jargon quá mức
- Ngắn gọn, đi thẳng vào việc
- Câu lệnh dùng động từ ("Tạo booking", không "Chức năng tạo booking")

### Ví dụ

| ❌ Không | ✅ Nên |
|---|---|
| "Xin lỗi, có lỗi xảy ra" | "Không kết nối được. Kiểm tra mạng và thử lại." |
| "Submit" | "Tạo booking" |
| "Nothing found" | "Chưa có cont phù hợp. Thử nới lỏng ngày khởi hành hoặc tuyến khác." |
| "Loading..." | "Đang phân tích 247 lô hàng..." |
| "Success!" | "Đã tạo booking. Mã: BK-4823" |

### Số liệu
- Tiền: `formatVnd()` — `46.000.000 ₫`
- Phần trăm: `formatPercent()` — `89.3%`
- ETA: `formatEtaWithMargin()` — `43 giờ 27 phút ±32p`
- Nhiệt độ: `15°C` (có ký hiệu °)
- Container ID: `MSKU 7823451` (space giữa prefix và số)
- Ngày: `22/09/2026` (dd/MM/yyyy)
- Giờ: `20:00 — 22/09/2026`

---

## 11. Anti-patterns cần tránh

- ❌ Gradient nhiều trên dashboard (chỉ hero)
- ❌ Emoji trong UI chính (chỉ dùng trong review text nếu người dùng gõ)
- ❌ Hover animation trên mọi card
- ❌ Border-radius khác nhau trong cùng section
- ❌ Shadow lớn (`shadow-xl`, `shadow-2xl`)
- ❌ Font weight nhẹ (300, 200) cho body
- ❌ ALL CAPS eyebrow label
- ❌ Trailing `→` trong text link
- ❌ Middle dot `·` để ghép meta strings
- ❌ Monospace cho label thường (chỉ cho container ID, tọa độ, số kỹ thuật)

---

**Nguyên tắc cuối cùng:**
> Nếu component nhìn giống mọi dashboard AI-generated khác, dừng lại và sửa. SmartCont phải có **đặc điểm riêng**: cold-chain-first, thuật ngữ logistics chuẩn, và sự chuyên nghiệp im lặng.
