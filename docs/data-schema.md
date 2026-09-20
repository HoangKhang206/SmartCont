# SmartCont — Data Schema Reference

> Cấu trúc JSON mock trong `data/`. Tham chiếu type đầy đủ trong `lib/types.ts`.

## Nguyên tắc chung

- Tất cả JSON là **static mock data** — được load lần đầu, sau đó ghi đè bởi localStorage.
- Không sửa trực tiếp file JSON khi vibe code trừ khi thêm mock scenario mới.
- Mỗi thay đổi runtime dùng `lib/data-store.ts` để đảm bảo persist.

---

## 1. `users.json` — người dùng

```typescript
User[]
```

**8 user seed:**
- 4 shipper (`shipper_001` → `shipper_004`)
- 4 carrier (`carrier_001` → `carrier_004`)

**Field key:**
- `id`: `shipper_XXX` hoặc `carrier_XXX`
- `role`: `"shipper"` | `"carrier"`
- `name`: Tiếng Việt có dấu
- `location`: Thành phố/tỉnh
- `avatarUrl`: DiceBear API generate từ tên

---

## 2. `routes.json` — tuyến đường

```typescript
Route[]
```

**4 tuyến seed:**
- `route_daklak_langson`: Đắk Lắk → Hữu Nghị (1720km, 34h)
- `route_daklak_mongcai`: Đắk Lắk → Móng Cái (1900km, 38h)
- `route_tiengiang_langson`: Tiền Giang → Hữu Nghị (1850km, 36h)
- `route_hcm_langson`: HCM → Hữu Nghị (1780km, 32h)

**Waypoints:** 15-22 điểm mỗi tuyến, đi theo QL1A hoặc đường Hồ Chí Minh, không xuyên rừng/biển.

**Dùng cho:** vẽ polyline trên map, GPS simulator interpolate marker.

---

## 3. `containers.json` — cont/chuyến

```typescript
Container[]
```

**7 container seed:**

| ID | Carrier | Type | Route | Trạng thái |
|---|---|---|---|---|
| `MSKU 7823451` | Vận tải Tuấn Phát | 40HC | Đắk Lắk → Hữu Nghị | Booked, sẵn ghép |
| `TCLU 4156789` | Cold Chain Logistics VN | 40ft | Đắk Lắk → Hữu Nghị | Booked, sẵn ghép |
| `MEDU 9234567` | Reefer Express | 20ft | Tiền Giang → Hữu Nghị | Booked (13°C) |
| `GESU 3345678` | Anh Tuấn Transport | 40HC | Đắk Lắk → Móng Cái | Booked, sẵn ghép |
| `FCIU 6789012` | Vận tải Tuấn Phát | 40ft | Tiền Giang → Hữu Nghị | Booked (8°C, thanh long) |
| `TRIU 1122334` | Cold Chain Logistics VN | 40HC | HCM → Hữu Nghị | **In-transit** (dùng kịch bản 4-5) |
| `MSKU 5567890` | Reefer Express | 20ft | Đắk Lắk → Hữu Nghị | Booked |

**Container ID format:** 4 chữ prefix + space + 7 số (chuẩn ISO 6346 giả).
Prefix hợp lệ: `MSKU` (Maersk), `TCLU` (Transcont), `MEDU` (MSC), `GESU` (Gesu), `FCIU` (FCIU), `TRIU` (Triton).

---

## 4. `shipments.json` — lô hàng

```typescript
Shipment[]
```

**7 shipment seed (bao gồm cho kịch bản demo):**

| ID | Shipper | Sản phẩm | RSL | Trạng thái | Ghi chú |
|---|---|---|---|---|---|
| `shipment_001` | Trần Văn Nam | Sầu Ri6 | 16.2 | pending_match | **Kịch bản 1** |
| `shipment_002` | Lê Minh Bình | Sầu Ri6 | 15.5 | pending_match | Ghép với 001 |
| `shipment_003` | Nguyễn Thị Lan | Sầu Monthong | 17.8 | pending_match | Ghép với 001 |
| `shipment_004` | Phạm Thị Hoa | Thanh long đỏ | 22.4 | pending_match | Nhiệt độ khác (8°C) |
| `shipment_005` | Trần Văn Nam | Sầu Ri6 | 12.8 | matched | Đã ghép GESU 3345678 |
| `shipment_006` | Nguyễn Thị Lan | Xoài cát Chu | 15.1 | pending_match | Nhiệt độ 13°C |
| `shipment_100` | Nguyễn Thị Lan | Sầu Ri6 | 14.8 | in_transit | **Kịch bản 4-5** |

**Field tính động:**
- `rsl`: tính bằng `calculateRSL()` trong `lib/fake-ai.ts`. Giá trị JSON là seed, khi tạo mới → tính lại.

---

## 5. `ratings.json` — đánh giá

```typescript
Rating[]
```

**7 rating seed** — đa dạng để carrier có history phong phú:

| Carrier | Rating | Ghi chú |
|---|---|---|
| Vận tải Tuấn Phát | 5, 4, 5 | 3 đánh giá, TB ~4.67 |
| Cold Chain Logistics VN | 5, 5 | 2 đánh giá, TB 5.0 |
| Reefer Express | 3 | 1 đánh giá 3⭐ (có phản hồi) |
| Anh Tuấn Transport | 4 | 1 đánh giá, có nhận xét lành nghề nhưng máy lạnh yếu |

**Phân bố nhắm tới:** 60% 5⭐, 25% 4⭐, 10% 3⭐, 4% 2⭐, 1% 1⭐ (tự nhiên).

**Review text:** dùng tiếng Việt tự nhiên, có khen có chê, có `carrierResponse` khi rating thấp.

---

## 6. `bookings.json` — lịch sử booking

```typescript
Booking[]
```

**3 booking history seed** — liên kết với rating để carrier stats hiển thị.

Status hiện tại đều là `completed`. Trong runtime khi tạo booking mới, status ban đầu là `pending` → `confirmed` → `in_progress` → `completed`.

---

## Cách thêm mock data mới

Khi cần thêm mock scenario (VD: kịch bản demo mới):

1. Thêm entry vào JSON tương ứng
2. Đảm bảo `id` unique, format đúng
3. Tính RSL bằng công thức thật (không nhập bừa)
4. Nếu là shipment/container liên kết → cập nhật cả 2 phía (`assignedShipmentIds`, `containerId`)
5. Restart dev server để reload JSON (nếu đang chạy)

---

## Cách reset trong lúc demo

Trong `lib/data-store.ts` có `resetDemoData()`.

Có thể expose qua nút ẩn ở footer landing page hoặc phím tắt (VD: `Ctrl+Shift+R` trong dev). Sau reset → localStorage empty → app đọc lại từ JSON seed.

---

## Storage keys (localStorage)

Prefix `smartcont:` để không đụng key khác trong browser.

```
smartcont:containers      → Container[]
smartcont:shipments       → Shipment[]
smartcont:ratings         → Rating[]
smartcont:bookings        → Booking[]
smartcont:notifications   → Notification[]
smartcont:incidents       → Incident[]
smartcont:currentUser     → User | null
```

Users và routes KHÔNG lưu localStorage (static).
