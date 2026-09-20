# SmartCont — Prompt Templates cho Claude CLI

> Copy-paste prompt bên dưới khi vibe code với `claude` CLI. Đã tối ưu để CLI trả về code đúng convention.

---

## 1. Prompt khởi động (mỗi session mới)

```
Đọc CLAUDE.md để nắm project context.
Sau đó đọc docs/component-list.md để biết task nào cần làm tiếp.
Báo cáo: task nào bạn đề xuất làm trước và tại sao.
```

---

## 2. Build shadcn base

```
Cài các shadcn/ui components trong docs/component-list.md Phase 0:
button, card, input, label, form, dialog, dropdown-menu, select, tabs,
table, badge, avatar, progress, separator, skeleton, tooltip, sheet.

Chạy `npx shadcn@latest add [component]` cho từng cái.
Sau khi cài xong, verify components/ui/ có đủ file.
```

---

## 3. Build 1 component shared

Template:
```
Build component components/shared/[TÊN].tsx theo mô tả trong docs/component-list.md.

Yêu cầu:
- Đọc docs/ui-design-guide.md phần liên quan trước khi code
- Dùng TypeScript, không any
- Props interface: [Tên]Props
- Import types từ lib/types.ts nếu cần
- Style bằng Tailwind + CSS variables (không hardcode màu)
- Server Component mặc định, chỉ "use client" nếu cần state
- Kèm 1 ví dụ sử dụng ở cuối file (dạng comment)
```

Ví dụ cụ thể:
```
Build components/shared/StatusBadge.tsx.

Component nhận prop `status: ContainerPhase | ShipmentStatus`, render Badge shadcn với:
- Màu semantic (booked = default, in_transit = cold, delivered = success, cancelled = destructive)
- Text tiếng Việt lấy từ PHASE_LABELS trong lib/constants.ts
- Kích thước sm mặc định
- Icon nhỏ bên trái phù hợp status (dùng lucide-react)
```

---

## 4. Build 1 page

Template:
```
Build app/[route]/page.tsx theo mô tả trong docs/component-list.md.

Yêu cầu:
- Nếu là page shipper/carrier: dùng DashboardShell layout
- Import data từ lib/data-store.ts (không import trực tiếp JSON)
- Nếu có form: dùng react-hook-form + zod (schema riêng)
- Nếu có action AI: dùng LoadingSteps component + function từ lib/fake-ai.ts
- Empty state, loading skeleton, error state đầy đủ
- Toast notifications cho mọi action
- Responsive mobile-first
```

Ví dụ cụ thể:
```
Build app/shipper/shipments/new/page.tsx — form tạo shipment mới.

Yêu cầu:
- Form fields: sản phẩm (select từ PRODUCTS), khối lượng (number), thể tích (number),
  ngày cắt (date), độ chín (slider 0-100), nhiệt độ (number), địa chỉ vựa (text),
  cảng đích (select), deadline (date)
- Validation zod (đọc quy tắc 6 trong docs/anti-detection-rules.md)
- Sau submit: gọi calculateRSL, saveShipment, toast success, redirect về /shipper/shipments
- Kịch bản demo 1 phải chạy được (docs/demo-scenarios.md)
```

---

## 5. Build feature "AI"

```
Build [tính năng AI cụ thể].

BẮT BUỘC theo docs/anti-detection-rules.md:
- Loading time 1.5-3s với ít nhất 4 status text đa dạng
- Progress callback từ lib/fake-ai.ts
- Kết quả có confidence score, margin, factors
- Sau khi có kết quả: toast + persist localStorage

Ví dụ status text: "Đang phân tích ...", "Tính điểm tương thích ...",
"Kiểm tra ràng buộc ...", "Tối ưu ...".
```

---

## 6. Build map component

```
Build components/map/RouteMap.tsx.

Đọc trước: docs/ui-design-guide.md phần 9 (Map).

Yêu cầu:
- Dynamic import react-leaflet với ssr: false (Next.js SSR guard)
- Props: route (Route), currentPosition?, showBorderMarker?
- Render:
  - Tile OpenStreetMap
  - Polyline route từ waypoints (color accent, weight 4)
  - Marker origin (Warehouse icon primary)
  - Marker destination (Flag icon warning)
  - Nếu có currentPosition: Marker Truck với rotation theo heading
- Auto-fit bounds tất cả markers
- Height responsive: h-96 desktop, h-64 mobile
- Kèm CSS import "leaflet/dist/leaflet.css" (có thể phải import trong globals.css)
```

---

## 7. Test kịch bản demo

```
Test kịch bản [số] trong docs/demo-scenarios.md.

Chạy dev server, browser mở /, thực hiện từng bước trong kịch bản.
Báo cáo:
- Bước nào chạy OK
- Bước nào lỗi/thiếu, cần fix gì
- Console tab có log rác nào không
- Toast/loading có đúng như yêu cầu không
```

---

## 8. Debug 1 file

```
File [đường dẫn] đang lỗi: [mô tả lỗi].

Đọc file, tìm nguyên nhân, sửa.
Không đổi convention/stack tùy tiện.
Sau khi sửa: giải thích ngắn cái đã sửa và tại sao.
```

---

## 9. Refactor để đẹp hơn

```
Xem lại [file/component].

Check các anti-pattern trong docs/ui-design-guide.md phần 11:
- Gradient không cần thiết
- Emoji trong UI chính
- Hover animation trên mọi card
- Border-radius không nhất quán
- Shadow quá lớn
- Font weight nhẹ
- ALL CAPS eyebrow

Refactor để tuân thủ design guide. Không đổi logic, chỉ đổi styling.
```

---

## 10. Chuẩn bị demo

```
Chuẩn bị final cho buổi demo.

Checklist docs/anti-detection-rules.md phần cuối:
1. Grep console.log, console.warn, console.error → xoá hết
2. Grep TODO, FIXME, FAKE, MOCK, HARDCODED → xoá hết
3. Build production: npm run build → verify không lỗi
4. Reset demo data → chạy 5 kịch bản → mỗi kịch bản báo cáo pass/fail
5. Test incognito browser → có bị bug gì không
6. Test responsive mobile viewport 375px

Báo cáo kết quả từng mục.
```

---

## 11. Deploy lên Vercel

```
Deploy dự án lên Vercel.

Bước:
1. Verify build local: npm run build → OK
2. Push code lên GitHub (nếu chưa có repo, giúp mình tạo)
3. Hướng dẫn connect với Vercel qua CLI hoặc dashboard
4. Config env vars nếu cần (project này không cần vì không có backend)
5. Sau khi deploy: test link production, verify không lỗi

Cho mình lệnh cụ thể để chạy.
```

---

## Tips khi prompt

- **Chỉ định file cụ thể**, đừng nói "làm shipper dashboard" chung chung → nói "làm `app/shipper/dashboard/page.tsx`"
- **Reference docs**: luôn ép CLI đọc docs liên quan trước
- **Chia nhỏ**: 1 component/page = 1 prompt, đừng ghép 5 việc
- **Verify sau**: sau khi CLI code xong, prompt "Verify code này chạy được không, có warning/error gì không?"
- **Không đổi stack**: nếu CLI đề xuất thêm dependency lạ, từ chối → "Không, dùng stack đã có trong CLAUDE.md"
