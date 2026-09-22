// ===== USER & ROLE =====
export type UserRole = "shipper" | "carrier"

export interface User {
  id: string
  role: UserRole
  name: string
  phone: string
  avatarUrl?: string
  location?: string
}

// ===== PRODUCT (nông sản) =====
export type ProductType =
  | "durian_ri6"
  | "durian_monthong"
  | "mango_catchu"
  | "dragonfruit_white"
  | "dragonfruit_red"
  | "rambutan"
  | "longan"

export interface RSLModel {
  beta0: number        // Q0 intercept
  beta2: number        // DAA coefficient (số ngày sau ra hoa)
  beta3: number        // MS coefficient (điểm độ chín 1–5)
  kRef: number         // k tại T_ref (tốc độ suy giảm tham chiếu)
  q10: number          // hệ số Q10
  tRef: number         // nhiệt độ tham chiếu (°C)
  qMin: number         // ngưỡng chất lượng tối thiểu chấp nhận được
  daaRange: [number, number]  // [min, max] DAA hợp lệ cho loại quả này
}

export interface ProductInfo {
  code: ProductType
  nameVi: string
  nameEn: string
  baseShelfLifeDays: number    // ở nhiệt độ chuẩn (dùng để hiển thị tham khảo)
  optimalTempC: number         // set-point khuyến nghị
  humidityPercent: [number, number]
  ethyleneClass: "low" | "medium" | "high"
  rslModel: RSLModel
}

// ===== SHIPMENT (lô hàng) =====
export type ShipmentStatus =
  | "draft"
  | "pending_match"     // đang chờ ghép cont
  | "matched"           // đã ghép/book cont
  | "in_transit"
  | "at_border"
  | "cleared"
  | "delivered"
  | "cancelled"

export interface Shipment {
  id: string
  shipperId: string
  shipperName: string
  productType: ProductType
  weightKg: number
  volumeM3: number
  harvestDate: string           // ISO date
  daa: number                   // Days After Anthesis — số ngày từ khi ra hoa đến khi cắt
  maturityScore: number         // MS 1–5 (1=non, 3=chín thương mại, 5=chín hoàn toàn)
  temperatureRequiredC: number
  originAddress: string
  originCity: string
  destination: string           // e.g. "Bằng Tường (Pingxiang)"
  destinationBorder: string     // e.g. "Hữu Nghị"
  deadlineDate: string          // ISO date
  status: ShipmentStatus
  rsl: number                   // tính động, số ngày tươi còn lại
  containerId?: string          // sau khi ghép
  createdAt: string
  // Sầu riêng xuất TQ: bắt buộc theo quy định Cục BVTV
  growingAreaCode?: string      // Mã số vùng trồng do Cục BVTV cấp
  packingFacilityCode?: string  // Mã số cơ sở đóng gói do Cục BVTV cấp
}

// ===== CONTAINER (cont/chuyến) =====
export type ContainerType = "reefer_20ft" | "reefer_40ft" | "reefer_40hc"

export type ContainerPhase =
  | "booked"
  | "en_route_to_warehouse"
  | "at_warehouse"
  | "loading"
  | "in_transit"
  | "at_border"
  | "customs_clearance"
  | "cleared_border"
  | "at_destination"
  | "delivered"

export const PHASE_ORDER: ContainerPhase[] = [
  "booked",
  "en_route_to_warehouse",
  "at_warehouse",
  "loading",
  "in_transit",
  "at_border",
  "customs_clearance",
  "cleared_border",
  "at_destination",
  "delivered",
]

export type PaymentMode = "full" | "deposit"

export interface Container {
  id: string                    // e.g. "MSKU 1234567"
  carrierId: string
  carrierName: string
  type: ContainerType
  capacityKg: number
  capacityM3: number
  temperatureSetpointC: number
  routeId: string
  departureDate: string         // ISO datetime
  arrivalEstimateDate: string   // ISO datetime baseline
  pricePerCubicMeter: number    // VND
  priceForFullContainer: number // VND
  availableForConsolidation: boolean
  paymentMode: PaymentMode      // full = thanh toán toàn bộ, deposit = đặt cọc 2 giai đoạn
  depositPercent?: number       // 10-70, chỉ dùng khi paymentMode = "deposit"
  currentPhase: ContainerPhase
  currentPosition?: GPSPosition
  assignedShipmentIds: string[]
  utilizationPercent: number    // 0-100
  createdAt: string
}

// ===== ROUTE (tuyến đường) =====
export interface Route {
  id: string
  name: string                  // e.g. "Đắk Lắk → Hữu Nghị"
  originCity: string
  originCoords: [number, number]  // [lat, lng]
  destinationCity: string
  destinationCoords: [number, number]
  waypoints: [number, number][] // polyline points
  distanceKm: number
  baseHours: number             // baseline duration
  borderCrossing: string
}

// ===== GPS & TRACKING =====
export interface GPSPosition {
  lat: number
  lng: number
  heading?: number              // degrees 0-360
  speedKmh?: number
  timestamp: string
}

export interface TrackingUpdate {
  containerId: string
  position: GPSPosition
  phase: ContainerPhase
  predictedEta: ETAPrediction
  temperatureC: number
  humidityPercent: number
  updatedAt: string
}

// ===== ETA PREDICTION =====
export interface ETAPrediction {
  hoursRemaining: number        // e.g. 43.4
  minutesLabel: string          // e.g. "43 giờ 27 phút"
  arrivalTimeIso: string
  confidencePercent: number     // 0-100
  marginMinutes: number         // ± phút
  factors: ETAFactor[]
}

export interface ETAFactor {
  key: "weather" | "border_congestion" | "traffic" | "time_of_day" | "season"
  label: string                 // Vietnamese label
  impactMinutes: number         // + delay, - faster
  severity: "low" | "medium" | "high"
}

// ===== INCIDENT (sự cố) =====
export type IncidentType =
  | "traffic_jam"
  | "vehicle_breakdown"
  | "temperature_deviation"
  | "border_delay"
  | "weather"
  | "other"

export type IncidentSeverity = "info" | "warning" | "critical"

export interface Incident {
  id: string
  containerId: string
  type: IncidentType
  severity: IncidentSeverity
  title: string
  description: string
  reportedAt: string
  reportedBy: string            // carrier userId
  resolved: boolean
  resolvedAt?: string
}

// ===== RATING (đánh giá) =====
export interface RatingCriteria {
  punctuality: number           // 1-5
  coldChain: number             // 1-5
  driverAttitude: number        // 1-5
  cargoCondition: number        // 1-5
}

export interface Rating {
  id: string
  bookingId: string
  containerId: string
  shipperId: string
  shipperName: string
  carrierId: string
  carrierName: string
  overallScore: number          // 1-5 (avg of criteria or standalone)
  criteria: RatingCriteria
  reviewText: string
  photos?: string[]
  createdAt: string
  editableUntil: string
  carrierResponse?: {
    text: string
    respondedAt: string
  }
}

export interface CarrierStats {
  carrierId: string
  avgOverall: number
  totalReviews: number
  avgByCriteria: RatingCriteria
  distribution: {
    star5: number
    star4: number
    star3: number
    star2: number
    star1: number
  }
}

// ===== CONSOLIDATION (ghép cont) =====
export interface ConsolidationSuggestion {
  containerId: string
  container: Container
  matchedShipments: Shipment[]
  utilizationPercent: number    // sau khi ghép
  compatibilityScore: number    // 0-100
  reasons: string[]             // e.g. "RSL chênh lệch 2 ngày (OK)", "Cùng cảng đích"
  warnings: string[]            // e.g. "Cần đóng gói tránh va chạm"
  totalWeightKg: number
  totalVolumeM3: number
}

// ===== BOOKING =====
export type BookingType = "fcl" | "consolidation"

export interface Booking {
  id: string
  type: BookingType
  shipperId: string
  containerId: string
  shipmentIds: string[]         // 1 cho FCL, nhiều cho consolidation
  totalPriceVnd: number
  status: "pending" | "awaiting_payment" | "confirmed" | "in_progress" | "completed" | "cancelled"
  bookedAt: string
  confirmedAt?: string
  depositPaidAt?: string        // giai đoạn 1 khi paymentMode = "deposit"
  paidAt?: string               // thanh toán toàn bộ hoặc giai đoạn 2
  completedAt?: string
  ratingId?: string
}

// ===== NOTIFICATION =====
export type NotificationType =
  | "phase_update"
  | "eta_change"
  | "incident"
  | "booking_confirmed"
  | "rating_received"
  | "consolidation_match"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  containerId?: string
  read: boolean
  createdAt: string
}
