# SmartCont — Component Build List

> Thứ tự build theo priority. Build xong 1 group thì test, mới sang group tiếp theo.

## Phase 0: shadcn/ui Base Components

Cài qua CLI (`npx shadcn@latest add ...`):

- [x] `button`
- [x] `card`
- [x] `input`
- [x] `label`
- [x] `form`
- [x] `dialog`
- [x] `dropdown-menu`
- [x] `select`
- [x] `tabs`
- [x] `table`
- [x] `badge`
- [x] `avatar`
- [x] `progress`
- [x] `separator`
- [x] `skeleton`
- [x] `tooltip`
- [x] `sheet` (mobile drawer)

## Phase 1: Shared Components

`components/shared/`

- [ ] **`Logo.tsx`** — logo SmartCont (chữ + icon Container)
- [ ] **`RoleSwitcher.tsx`** — dropdown chuyển giữa Shipper/Carrier role
- [ ] **`TopBar.tsx`** — top navigation với logo, role switch, notification bell, user avatar
- [ ] **`Sidebar.tsx`** — sidebar navigation (khác nhau theo role)
- [ ] **`DashboardShell.tsx`** — layout wrapper: TopBar + Sidebar + Main
- [ ] **`LiveIndicator.tsx`** — chấm xanh nhấp nháy "Live"
- [ ] **`StatusBadge.tsx`** — badge cho phase/status với màu semantic
- [ ] **`PriceDisplay.tsx`** — format VND với ký hiệu ₫
- [ ] **`EmptyState.tsx`** — empty state generic (icon + text + CTA)
- [ ] **`ErrorState.tsx`** — error state generic
- [ ] **`LoadingSteps.tsx`** — loading với status text đa dạng (dùng cho AI actions)
- [ ] **`NotificationBell.tsx`** — bell icon với badge số notif chưa đọc

## Phase 2: Landing & Auth

`app/`

- [ ] **`app/page.tsx`** — landing page (hero + features + CTA "Bắt đầu")
- [ ] **`app/(auth)/select-role/page.tsx`** — chọn role (Shipper hoặc Carrier)
- [ ] **`app/(auth)/select-user/page.tsx`** — chọn user mock để login (skip auth thật)

## Phase 3: Shipper Interface

`app/shipper/`

### Dashboard
- [ ] **`app/shipper/dashboard/page.tsx`** — Overview: metric cards + upcoming shipments + recent activity
- [ ] **`components/shipper/ShipperMetrics.tsx`** — 4 metric cards (total shipments, in-transit, avg RSL, cost saved)
- [ ] **`components/shipper/UpcomingShipmentsTable.tsx`**
- [ ] **`components/shipper/RecentActivityFeed.tsx`**

### Shipments (Lô hàng)
- [ ] **`app/shipper/shipments/page.tsx`** — danh sách shipments của user
- [ ] **`app/shipper/shipments/new/page.tsx`** — form tạo shipment mới
- [ ] **`app/shipper/shipments/[id]/page.tsx`** — chi tiết shipment
- [ ] **`components/shipper/ShipmentForm.tsx`** — form với zod validation
- [ ] **`components/shipper/RslIndicator.tsx`** — hiển thị RSL với color-code (xanh > 15 ngày, vàng 8-15, đỏ <8)
- [ ] **`components/shipper/ShipmentCard.tsx`**

### Book Container
- [ ] **`app/shipper/containers/page.tsx`** — marketplace list cont với filter
- [ ] **`app/shipper/containers/[id]/page.tsx`** — chi tiết cont + form book
- [ ] **`components/shipper/ContainerCard.tsx`** — card hiển thị cont trong list
- [ ] **`components/shipper/ContainerFilter.tsx`** — filter panel (route, date, type, price)
- [ ] **`components/shipper/CarrierRatingBadge.tsx`** — badge sao carrier trong card

### Consolidation (Ghép cont)
- [ ] **`app/shipper/consolidation/page.tsx`** — flow ghép cont
- [ ] **`components/shipper/ConsolidationForm.tsx`** — chọn shipment + tìm ghép
- [ ] **`components/shipper/ConsolidationResults.tsx`** — hiển thị gợi ý ghép với loading steps
- [ ] **`components/shipper/ConsolidationCard.tsx`** — 1 gợi ý ghép (cont + shipments)

### Tracking
- [ ] **`app/shipper/tracking/page.tsx`** — list các cont đang track
- [ ] **`app/shipper/tracking/[containerId]/page.tsx`** — chi tiết tracking 1 cont
- [ ] **`components/shipper/PhaseTracker.tsx`** — timeline horizontal với phase hiện tại
- [ ] **`components/shipper/EtaCard.tsx`** — ETA với confidence + factors
- [ ] **`components/shipper/TemperatureChart.tsx`** — line chart nhiệt độ theo thời gian

### Ratings
- [ ] **`app/shipper/ratings/new/[bookingId]/page.tsx`** — form đánh giá 4 tiêu chí
- [ ] **`components/shipper/RatingForm.tsx`**
- [ ] **`components/shared/StarRating.tsx`** — component input sao (interactive)

## Phase 4: Carrier Interface

`app/carrier/`

### Dashboard
- [ ] **`app/carrier/dashboard/page.tsx`** — Overview: fleet status + rating + incoming bookings
- [ ] **`components/carrier/CarrierMetrics.tsx`** — 4 metric cards (fleet size, utilization avg, rating, monthly revenue)
- [ ] **`components/carrier/RatingBreakdown.tsx`** — bar chart phân bố 5-star
- [ ] **`components/carrier/IncomingBookings.tsx`** — list booking chờ confirm

### Containers (Chuyến/cont của mình)
- [ ] **`app/carrier/containers/page.tsx`** — list cont của carrier
- [ ] **`app/carrier/containers/new/page.tsx`** — publish cont mới
- [ ] **`app/carrier/containers/[id]/page.tsx`** — chi tiết + update phase
- [ ] **`components/carrier/ContainerForm.tsx`** — publish cont form
- [ ] **`components/carrier/PhaseUpdateButtons.tsx`** — buttons để carrier update phase

### Bookings received
- [ ] **`app/carrier/bookings/page.tsx`** — list booking từ shipper
- [ ] **`app/carrier/bookings/[id]/page.tsx`** — chi tiết + confirm/reject

### Incidents
- [ ] **`app/carrier/incidents/page.tsx`** — list incidents đã báo
- [ ] **`app/carrier/incidents/new/page.tsx`** — form báo sự cố
- [ ] **`components/carrier/IncidentForm.tsx`**

### Ratings received
- [ ] **`app/carrier/ratings/page.tsx`** — list review nhận được + phân bố
- [ ] **`components/carrier/RatingCard.tsx`** — 1 review với option phản hồi

## Phase 5: Map Components

`components/map/`

- [ ] **`components/map/RouteMap.tsx`** — Leaflet map hiển thị 1 route + marker cont di chuyển
- [ ] **`components/map/RouteMapPreview.tsx`** — preview nhỏ cho card (static)
- [ ] **`components/map/BorderMarker.tsx`** — marker cửa khẩu
- [ ] **`components/map/ContainerMarker.tsx`** — marker cont đang di chuyển (rotate theo heading)

**Lưu ý Leaflet:** phải dynamic import (`ssr: false`) vì window not defined SSR.

## Phase 6: Polish & Demo Prep

- [ ] Reset demo data button (ẩn trong footer)
- [ ] Notification system: simulate incoming notifications mỗi 30-60s
- [ ] Auto-progress cont phases khi user vào trang tracking (fake real-time)
- [ ] Toast notifications cho mọi event chính
- [ ] Kiểm tra 5 kịch bản demo (xem `demo-scenarios.md`)
- [ ] Xoá console.log, build production
- [ ] Test trên incognito browser
- [ ] Test trên mobile

## Priority Order (nếu thiếu thời gian)

**Must-have (60% điểm):**
1. Phase 1 Shared components
2. Phase 3: Dashboard shipper + form shipment + list container + book flow
3. Phase 4: Dashboard carrier + list bookings
4. Phase 5: Route map cơ bản
5. Phase 6: 3 kịch bản demo chính chạy end-to-end

**Should-have (85% điểm):**
6. Consolidation flow đầy đủ với AI loading
7. Tracking real-time với ETA update
8. Rating system

**Nice-to-have (100% điểm):**
9. Incident reporting
10. Notification real-time simulator
11. Dark mode
12. Mobile responsive perfect
