/**
 * Fake GPS simulator — marker di chuyển dọc polyline thật, không đi xuyên núi/hồ.
 */

import type { GPSPosition, Route } from "./types"

/**
 * Interpolate vị trí tại tiến độ 0-1 dọc theo polyline.
 * Progress = 0 → điểm đầu; progress = 1 → điểm cuối.
 */
export function interpolateAlongRoute(
  waypoints: [number, number][],
  progress: number
): [number, number] {
  if (waypoints.length === 0) return [0, 0]
  if (waypoints.length === 1) return waypoints[0]
  if (progress <= 0) return waypoints[0]
  if (progress >= 1) return waypoints[waypoints.length - 1]

  // Tính tổng độ dài
  const segmentLengths: number[] = []
  let totalLength = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    const len = haversineDistance(waypoints[i], waypoints[i + 1])
    segmentLengths.push(len)
    totalLength += len
  }

  // Tìm segment tương ứng với progress
  const targetDistance = totalLength * progress
  let accumulated = 0

  for (let i = 0; i < segmentLengths.length; i++) {
    if (accumulated + segmentLengths[i] >= targetDistance) {
      // Interpolate trong segment này
      const segmentProgress = (targetDistance - accumulated) / segmentLengths[i]
      const [lat1, lng1] = waypoints[i]
      const [lat2, lng2] = waypoints[i + 1]
      return [
        lat1 + (lat2 - lat1) * segmentProgress,
        lng1 + (lng2 - lng1) * segmentProgress,
      ]
    }
    accumulated += segmentLengths[i]
  }

  return waypoints[waypoints.length - 1]
}

/**
 * Haversine distance giữa 2 điểm (km).
 */
export function haversineDistance(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0])
  const lat2 = toRad(b[0])

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Tính heading (bearing) từ điểm A đến B, đơn vị độ 0-360.
 */
export function calculateHeading(
  from: [number, number],
  to: [number, number]
): number {
  const lat1 = toRad(from[0])
  const lat2 = toRad(to[0])
  const dLng = toRad(to[1] - from[1])

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  const bearing = (Math.atan2(y, x) * 180) / Math.PI
  return (bearing + 360) % 360
}

/**
 * Simulator: liên tục cập nhật vị trí marker dọc route.
 * Trả về cleanup function.
 */
export interface GpsSimulatorOptions {
  route: Route
  startProgress?: number         // 0-1
  durationMs?: number            // tổng thời gian đi hết route (ms)
  intervalMs?: number            // tần suất cập nhật
  onUpdate: (pos: GPSPosition, progress: number) => void
  onComplete?: () => void
}

export function startGpsSimulator(opts: GpsSimulatorOptions): () => void {
  const {
    route,
    startProgress = 0,
    durationMs = 30000, // 30s cho toàn route (demo speed)
    intervalMs = 2000,
    onUpdate,
    onComplete,
  } = opts

  let progress = startProgress
  const step = intervalMs / durationMs

  const interval = setInterval(() => {
    progress += step
    if (progress >= 1) {
      progress = 1
      clearInterval(interval)
      const pos = interpolateAlongRoute(route.waypoints, 1)
      onUpdate(
        {
          lat: pos[0],
          lng: pos[1],
          heading: 0,
          speedKmh: 0,
          timestamp: new Date().toISOString(),
        },
        1
      )
      onComplete?.()
      return
    }

    const currentPos = interpolateAlongRoute(route.waypoints, progress)
    const nextPos = interpolateAlongRoute(
      route.waypoints,
      Math.min(1, progress + 0.01)
    )
    const heading = calculateHeading(currentPos, nextPos)

    onUpdate(
      {
        lat: currentPos[0],
        lng: currentPos[1],
        heading,
        speedKmh: 65 + Math.random() * 15, // 65-80 km/h realistic
        timestamp: new Date().toISOString(),
      },
      progress
    )
  }, intervalMs)

  return () => clearInterval(interval)
}
