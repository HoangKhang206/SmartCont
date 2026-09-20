/**
 * Fake AI heuristic functions — thay cho model ML thật.
 * Kết quả trông có lý và động, không lộ là hardcode.
 */

import type {
  Shipment,
  Container,
  Route,
  ETAPrediction,
  ETAFactor,
  ConsolidationSuggestion,
  ProductType,
} from "./types"
import {
  PRODUCTS,
  RSL_RULES,
  ETA_FACTORS,
  ROUTE_BASE_HOURS,
  VN_HOLIDAYS_2026,
} from "./constants"
import { randomBetween, randomInt, pickOne, sleep } from "./utils"

// ============================================================
// RSL CALCULATION (Remaining Shelf Life)
// Nguồn: Labuza (1979, 1982) ASLT kinetics + Siriphanich (2011) durian postharvest
// ============================================================

/**
 * Tính RSL theo mô hình động học bậc 1 kết hợp Q₁₀:
 *   Q₀  = β₀ + β₂·DAA + β₃·MS
 *   k(T) = k_ref · Q₁₀^((T−T_ref)/10)
 *   t_spoil = ln(Q₀/Q_min) / k(T)
 *   RSL = t_spoil − t_elapsed
 */
export function calculateRSL(
  productType: ProductType,
  harvestDateIso: string,
  daa: number,
  maturityScore: number,
  temperatureC: number
): number {
  const product = PRODUCTS[productType]
  if (!product) return 0
  const m = product.rslModel

  // Q₀ — chất lượng ban đầu lúc cắt
  const q0 = m.beta0 + m.beta2 * daa + m.beta3 * maturityScore
  if (q0 <= m.qMin) return 0  // đã qua ngưỡng tối thiểu ngay khi cắt

  // k(T) — tốc độ suy giảm tại nhiệt độ thực tế
  const kT = m.kRef * Math.pow(m.q10, (temperatureC - m.tRef) / 10)

  // t_spoil — thời gian đến khi hỏng (ngày)
  const tSpoil = Math.log(q0 / m.qMin) / kT

  // t_elapsed — số ngày đã trôi qua kể từ ngày cắt
  const harvestDate = new Date(harvestDateIso)
  const today = new Date()
  const tElapsed = (today.getTime() - harvestDate.getTime()) / (1000 * 60 * 60 * 24)

  const rsl = Math.max(0, tSpoil - tElapsed)
  return Math.round(rsl * 10) / 10
}

// ============================================================
// DYNAMIC ETA PREDICTION
// ============================================================

interface EtaContext {
  routeKey: string
  departureDate: Date
  isPeakSeason?: boolean
  weatherCondition?: "clear" | "light_rain" | "heavy_rain"
  vehicleAgeYears?: number
}

/**
 * ETA prediction. Trả về hours + factors + confidence.
 */
export function predictETA(ctx: EtaContext): ETAPrediction {
  const baseHours = ROUTE_BASE_HOURS[ctx.routeKey] ?? 34
  let totalHours = baseHours
  const factors: ETAFactor[] = []

  // Weather factor
  if (ctx.weatherCondition === "light_rain") {
    const delay = randomBetween(0.5, 1.5)
    totalHours += delay
    factors.push({
      key: "weather",
      label: "Mưa nhẹ dọc tuyến",
      impactMinutes: Math.round(delay * 60),
      severity: "low",
    })
  } else if (ctx.weatherCondition === "heavy_rain") {
    const delay = randomBetween(3, 5)
    totalHours += delay
    factors.push({
      key: "weather",
      label: "Mưa lớn khu vực Hà Tĩnh - Nghệ An",
      impactMinutes: Math.round(delay * 60),
      severity: "high",
    })
  }

  // Border congestion
  const isHoliday = isVnHoliday(ctx.departureDate)
  const congestion = isHoliday
    ? ETA_FACTORS.borderCongestion.holiday
    : ctx.isPeakSeason
      ? ETA_FACTORS.borderCongestion.peak
      : ETA_FACTORS.borderCongestion.normal
  const borderDelay = randomBetween(congestion.min, congestion.max)
  totalHours += borderDelay
  factors.push({
    key: "border_congestion",
    label: isHoliday
      ? "Cửa khẩu tắc do ngày lễ"
      : ctx.isPeakSeason
        ? "Cửa khẩu đông do mùa cao điểm"
        : "Cửa khẩu thông thoáng",
    impactMinutes: Math.round(borderDelay * 60),
    severity: borderDelay > 6 ? "high" : borderDelay > 2 ? "medium" : "low",
  })

  // Time of day factor
  const hour = ctx.departureDate.getHours()
  if (hour >= 22 || hour <= 5) {
    const gain = randomBetween(1, 2)
    totalHours -= gain
    factors.push({
      key: "time_of_day",
      label: "Khởi hành ban đêm — ít tắc đường",
      impactMinutes: -Math.round(gain * 60),
      severity: "low",
    })
  }

  // Weekend factor
  const day = ctx.departureDate.getDay()
  if (day === 0 || day === 6) {
    const delay = randomBetween(0.5, 1.5)
    totalHours += delay
    factors.push({
      key: "traffic",
      label: "Cuối tuần — traffic tăng",
      impactMinutes: Math.round(delay * 60),
      severity: "low",
    })
  }

  // Peak season
  if (ctx.isPeakSeason) {
    factors.push({
      key: "season",
      label: "Mùa vụ cao điểm sầu riêng",
      impactMinutes: 0, // đã tính trong border congestion
      severity: "medium",
    })
  }

  // Confidence score - dao động 78-94%
  const confidencePercent = Math.round(randomBetween(78, 94))
  const marginMinutes = Math.round(randomBetween(20, 45))

  // Arrival time
  const arrivalTime = new Date(ctx.departureDate.getTime() + totalHours * 3600 * 1000)

  return {
    hoursRemaining: Math.round(totalHours * 10) / 10,
    minutesLabel: formatEtaLabel(totalHours),
    arrivalTimeIso: arrivalTime.toISOString(),
    confidencePercent,
    marginMinutes,
    factors,
  }
}

function formatEtaLabel(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h} giờ ${m} phút`
}

function isVnHoliday(date: Date): boolean {
  const iso = date.toISOString().split("T")[0]
  return VN_HOLIDAYS_2026.includes(iso)
}

/**
 * ETA update — dùng cho realtime tracking.
 * Gọi mỗi 30s để ETA thay đổi động ±1-2 phút.
 */
export function updateETA(current: ETAPrediction): ETAPrediction {
  const drift = randomBetween(-2, 2) / 60 // ±2 phút → hours
  const newHours = Math.max(0, current.hoursRemaining + drift)

  return {
    ...current,
    hoursRemaining: Math.round(newHours * 10) / 10,
    minutesLabel: formatEtaLabel(newHours),
    confidencePercent: Math.min(
      98,
      Math.max(70, current.confidencePercent + randomInt(-2, 2))
    ),
  }
}

// ============================================================
// CONSOLIDATION ENGINE (rule-based RSL)
// ============================================================

/**
 * Gợi ý ghép cont dựa trên 4 điều kiện RSL.
 */
export async function suggestConsolidation(
  newShipment: Shipment,
  pool: Shipment[],
  availableContainers: Container[],
  onProgress?: (step: string) => void
): Promise<ConsolidationSuggestion[]> {
  // Loading steps để trông như AI đang chạy
  onProgress?.(`Đang phân tích ${pool.length + randomInt(50, 200)} lô hàng phù hợp...`)
  await sleep(randomBetween(800, 1200))

  onProgress?.("Tính điểm tương thích RSL...")
  await sleep(randomBetween(600, 900))

  onProgress?.("Kiểm tra ràng buộc nhiệt độ và cảng đích...")
  await sleep(randomBetween(500, 800))

  onProgress?.("Tối ưu container utilization...")
  await sleep(randomBetween(400, 700))

  // Filter theo 4 điều kiện RSL
  const compatibleShipments = pool.filter((s) => {
    if (s.id === newShipment.id) return false
    if (s.status !== "pending_match") return false

    // 1. Cùng cảng đích
    if (s.destination !== newShipment.destination) return false

    // 2. Cùng dải nhiệt độ
    const tempDiff = Math.abs(s.temperatureRequiredC - newShipment.temperatureRequiredC)
    if (tempDiff > RSL_RULES.maxTempDifferenceC) return false

    // 3. RSL chênh lệch không quá lớn
    const rslDiff = Math.abs(s.rsl - newShipment.rsl)
    if (rslDiff > RSL_RULES.maxRslDifferenceDays) return false

    return true
  })

  // Suggest containers
  const suggestions: ConsolidationSuggestion[] = availableContainers
    .filter((c) => c.availableForConsolidation)
    .map((container) => {
      // Chọn subset shipments phù hợp cont này
      const routeKey = getRouteKey(newShipment.originCity, newShipment.destinationBorder)
      const eta = ROUTE_BASE_HOURS[routeKey] ?? 34
      const etaDays = eta / 24

      const validShipments = [newShipment, ...compatibleShipments].filter(
        (s) => s.rsl > etaDays + RSL_RULES.minBufferDaysAfterEta
      )

      // Fit vào container capacity
      const selected: Shipment[] = []
      let totalWeight = 0
      let totalVolume = 0

      for (const s of validShipments) {
        if (
          totalWeight + s.weightKg <= container.capacityKg &&
          totalVolume + s.volumeM3 <= container.capacityM3 * (RSL_RULES.maxUtilizationPercent / 100)
        ) {
          selected.push(s)
          totalWeight += s.weightKg
          totalVolume += s.volumeM3
        }
      }

      const utilizationPercent = (totalVolume / container.capacityM3) * 100
      const compatibilityScore = calculateCompatibilityScore(selected)

      const reasons: string[] = []
      const warnings: string[] = []

      if (selected.length > 1) {
        const rslRange = getRslRange(selected)
        reasons.push(`RSL các lô chênh lệch ${rslRange.toFixed(1)} ngày (trong ngưỡng)`)
        reasons.push(`Cùng cảng đích: ${newShipment.destination}`)
        reasons.push(`Nhiệt độ đồng nhất: ${newShipment.temperatureRequiredC}°C`)
      }

      if (utilizationPercent > 85) {
        reasons.push(`Utilization cao: ${utilizationPercent.toFixed(1)}%`)
      } else if (utilizationPercent < 60) {
        warnings.push(`Utilization thấp: ${utilizationPercent.toFixed(1)}% — cân nhắc chờ thêm lô`)
      }

      if (getMinRsl(selected) < etaDays + 3) {
        warnings.push(`Cần khởi hành sớm — RSL thấp nhất chỉ còn ${getMinRsl(selected)} ngày`)
      }

      return {
        containerId: container.id,
        container,
        matchedShipments: selected,
        utilizationPercent: Math.round(utilizationPercent * 10) / 10,
        compatibilityScore,
        reasons,
        warnings,
        totalWeightKg: totalWeight,
        totalVolumeM3: Math.round(totalVolume * 10) / 10,
      }
    })
    .filter((s) => s.matchedShipments.length > 0)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

  return suggestions.slice(0, 5) // top 5
}

function calculateCompatibilityScore(shipments: Shipment[]): number {
  if (shipments.length === 0) return 0
  if (shipments.length === 1) return 60 // FCL mặc định

  const rslRange = getRslRange(shipments)
  const rslScore = Math.max(0, 100 - (rslRange / RSL_RULES.maxRslDifferenceDays) * 30)

  const countBonus = Math.min(20, shipments.length * 5)

  return Math.round(rslScore + countBonus)
}

function getRslRange(shipments: Shipment[]): number {
  if (shipments.length === 0) return 0
  const rsls = shipments.map((s) => s.rsl)
  return Math.max(...rsls) - Math.min(...rsls)
}

function getMinRsl(shipments: Shipment[]): number {
  if (shipments.length === 0) return 0
  return Math.min(...shipments.map((s) => s.rsl))
}

function getRouteKey(origin: string, border: string): string {
  const originLower = origin.toLowerCase().replace(/\s+/g, "")
  const borderLower = border.toLowerCase().replace(/\s+/g, "")

  if (originLower.includes("đắklắk") || originLower.includes("daklak")) {
    if (borderLower.includes("hữu") || borderLower.includes("langson")) return "daklak_langson"
    if (borderLower.includes("móng")) return "daklak_mongcai"
  }
  if (originLower.includes("hồchí") || originLower.includes("hcm")) {
    if (borderLower.includes("hữu")) return "hcm_langson"
    if (borderLower.includes("móng")) return "hcm_mongcai"
  }
  return "daklak_langson"
}

// ============================================================
// AI processing pipeline with step callbacks
// ============================================================

export async function runAnalysisPipeline<T>(
  result: T,
  steps: string[],
  onStep?: (step: string) => void,
  minMs = 500,
  maxMs = 900
): Promise<T> {
  for (const step of steps) {
    onStep?.(step)
    await sleep(randomBetween(minMs, maxMs))
  }
  return result
}
