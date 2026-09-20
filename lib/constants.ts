import type { ProductInfo, ProductType, ContainerType, ContainerPhase } from "./types"

// ===== PRODUCT DATABASE =====
// Nguồn: FAO Postharvest Handbook, USDA Handbook 66, SOFRI
export const PRODUCTS: Record<ProductType, ProductInfo> = {
  durian_ri6: {
    code: "durian_ri6",
    nameVi: "Sầu riêng Ri6",
    nameEn: "Durian Ri6",
    baseShelfLifeDays: 21,
    optimalTempC: 15,
    humidityPercent: [85, 90],
    ethyleneClass: "high",
    // Calibrated: DAA=108, MS=3, T=15°C → RSL≈21 ngày
    rslModel: { beta0: 100, beta2: -0.38, beta3: -5.5, kRef: 0.090, q10: 2.5, tRef: 25, qMin: 20, daaRange: [90, 120] },
  },
  durian_monthong: {
    code: "durian_monthong",
    nameVi: "Sầu riêng Monthong",
    nameEn: "Durian Monthong",
    baseShelfLifeDays: 24,
    optimalTempC: 15,
    humidityPercent: [85, 90],
    ethyleneClass: "high",
    // Calibrated: DAA=110, MS=3, T=15°C → RSL≈24 ngày
    rslModel: { beta0: 105, beta2: -0.35, beta3: -5.0, kRef: 0.099, q10: 2.5, tRef: 25, qMin: 20, daaRange: [95, 120] },
  },
  mango_catchu: {
    code: "mango_catchu",
    nameVi: "Xoài cát Chu",
    nameEn: "Cat Chu Mango",
    baseShelfLifeDays: 18,
    optimalTempC: 13,
    humidityPercent: [85, 90],
    ethyleneClass: "medium",
    // Calibrated: DAA=95, MS=3, T=13°C → RSL≈18 ngày
    rslModel: { beta0: 95, beta2: -0.42, beta3: -6.0, kRef: 0.095, q10: 2.3, tRef: 25, qMin: 20, daaRange: [85, 110] },
  },
  dragonfruit_white: {
    code: "dragonfruit_white",
    nameVi: "Thanh long ruột trắng",
    nameEn: "White Dragon Fruit",
    baseShelfLifeDays: 28,
    optimalTempC: 8,
    humidityPercent: [85, 90],
    ethyleneClass: "low",
    // Calibrated: DAA=30, MS=3, T=8°C → RSL≈28 ngày
    rslModel: { beta0: 90, beta2: -1.00, beta3: -4.5, kRef: 0.098, q10: 2.0, tRef: 25, qMin: 20, daaRange: [25, 38] },
  },
  dragonfruit_red: {
    code: "dragonfruit_red",
    nameVi: "Thanh long ruột đỏ",
    nameEn: "Red Dragon Fruit",
    baseShelfLifeDays: 25,
    optimalTempC: 8,
    humidityPercent: [85, 90],
    ethyleneClass: "low",
    // Calibrated: DAA=30, MS=3, T=8°C → RSL≈25 ngày
    rslModel: { beta0: 88, beta2: -1.00, beta3: -5.0, kRef: 0.099, q10: 2.0, tRef: 25, qMin: 20, daaRange: [25, 38] },
  },
  rambutan: {
    code: "rambutan",
    nameVi: "Chôm chôm",
    nameEn: "Rambutan",
    baseShelfLifeDays: 14,
    optimalTempC: 10,
    humidityPercent: [90, 95],
    ethyleneClass: "low",
    // Calibrated: DAA=105, MS=3, T=10°C → RSL≈14 ngày
    rslModel: { beta0: 85, beta2: -0.35, beta3: -7.0, kRef: 0.104, q10: 2.8, tRef: 25, qMin: 20, daaRange: [95, 125] },
  },
  longan: {
    code: "longan",
    nameVi: "Nhãn",
    nameEn: "Longan",
    baseShelfLifeDays: 21,
    optimalTempC: 5,
    humidityPercent: [90, 95],
    ethyleneClass: "low",
    // Calibrated: DAA=80, MS=3, T=5°C → RSL≈21 ngày
    rslModel: { beta0: 90, beta2: -0.42, beta3: -5.5, kRef: 0.174, q10: 2.3, tRef: 25, qMin: 20, daaRange: [70, 95] },
  },
}

// ===== CONTAINER SPECS =====
// Nguồn: Maersk, ONE, CMA CGM equipment datasheets
export const CONTAINER_SPECS: Record<
  ContainerType,
  { nameVi: string; capacityKg: number; capacityM3: number; dimensionM: string }
> = {
  reefer_20ft: {
    nameVi: "Reefer 20ft",
    capacityKg: 27000,
    capacityM3: 28,
    dimensionM: "5.44 × 2.29 × 2.27",
  },
  reefer_40ft: {
    nameVi: "Reefer 40ft",
    capacityKg: 29000,
    capacityM3: 58,
    dimensionM: "11.58 × 2.29 × 2.27",
  },
  reefer_40hc: {
    nameVi: "Reefer 40ft HC",
    capacityKg: 29000,
    capacityM3: 67,
    dimensionM: "11.58 × 2.29 × 2.51",
  },
}

// ===== PHASE LABELS (Vietnamese) =====
export const PHASE_LABELS: Record<ContainerPhase, string> = {
  booked: "Chờ xuất phát",
  en_route_to_warehouse: "Đang đến vựa",
  at_warehouse: "Đến vựa",
  loading: "Đang bốc hàng",
  in_transit: "Đang vận chuyển",
  at_border: "Đến cửa khẩu",
  customs_clearance: "Đang thông quan",
  cleared_border: "Đã qua biên giới",
  at_destination: "Đến điểm giao",
  delivered: "Đã giao",
}

// ===== ROUTE BASELINE (giờ di chuyển baseline) =====
// Dựa trên Google Maps + kinh nghiệm tài xế đường dài
export const ROUTE_BASE_HOURS: Record<string, number> = {
  "daklak_langson": 34,      // ~1700km, Đắk Lắk → Lạng Sơn
  "daklak_mongcai": 38,      // Đắk Lắk → Móng Cái
  "tiengiang_langson": 36,   // Tiền Giang → Lạng Sơn
  "hcm_langson": 32,         // TP.HCM → Lạng Sơn
  "hcm_mongcai": 36,         // TP.HCM → Móng Cái
  "bentre_langson": 37,      // Bến Tre → Lạng Sơn
}

// ===== PRICING (giá cước tham khảo, VND) =====
export const PRICING = {
  perCubicMeterVnd: {
    reefer_20ft: 850_000,    // giá ghép cont /m³
    reefer_40ft: 720_000,
    reefer_40hc: 680_000,
  },
  fullContainerVnd: {
    reefer_20ft: 24_000_000,
    reefer_40ft: 42_000_000,
    reefer_40hc: 46_000_000,
  },
  borderClearanceVnd: 2_500_000, // phí thông quan trung bình
}

// ===== RSL RULES (ghép cont) =====
export const RSL_RULES = {
  maxRslDifferenceDays: 3,         // chênh lệch RSL tối đa giữa các lô
  minBufferDaysAfterEta: 2,        // RSL min phải > ETA + buffer
  maxTempDifferenceC: 1,           // chênh lệch nhiệt độ set-point
  maxUtilizationPercent: 90,       // chừa 10% cho thông khí lạnh
}

// ===== ETA FACTORS (trọng số cho mô hình dự báo) =====
export const ETA_FACTORS = {
  rainImpactHours: { light: 1, medium: 3, heavy: 5 },
  borderCongestion: {
    normal: { min: 0.5, max: 2 },
    peak: { min: 4, max: 12 },
    holiday: { min: 12, max: 48 },
  },
  weekendFactor: 1.15,
  nightFactor: 0.85,         // đêm nhanh hơn ban ngày
  peakSeasonFactor: 1.2,     // mùa cao điểm chậm hơn
}

// ===== VIETNAMESE HOLIDAYS (peak border congestion) =====
export const VN_HOLIDAYS_2026 = [
  "2026-01-01", // Tết Dương lịch
  "2026-02-17", // Mùng 1 Tết
  "2026-02-18",
  "2026-02-19",
  "2026-04-30", // Giải phóng
  "2026-05-01", // Quốc tế Lao động
  "2026-09-02", // Quốc khánh
]

// ===== APP CONSTANTS =====
export const APP = {
  name: "SmartDurian",
  tagline: "Ghép cont lạnh thông minh cho SME nông sản",
  currency: "VND",
  locale: "vi-VN",
}
