"use client"

import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from "react-leaflet"
import { getContainers, getRouteById } from "@/lib/data-store"

const CITY_COORDS: Record<string, [number, number]> = {
  "Đắk Lắk":    [12.690, 108.038],
  "Tiền Giang":  [10.360, 106.365],
  "Lâm Đồng":   [11.940, 108.436],
  "Bình Thuận":  [11.095, 108.073],
  "Long An":     [10.544, 106.408],
  "Đồng Nai":   [10.946, 107.241],
  "Quy Nhơn":   [13.776, 109.224],
  "Đà Nẵng":    [16.054, 108.202],
  "Khánh Hòa":  [12.239, 109.197],
  "Hà Nội":     [21.028, 105.854],
  "TP.HCM":     [10.776, 106.701],
}

// Border crossing (destination)
const BORDER: [number, number] = [21.972, 106.722]

function getColor(count: number): string {
  if (count >= 5) return "#10b981"
  if (count >= 1) return "#f59e0b"
  return "#ef4444"
}

export default function NetworkMapLeaflet() {
  const containers = getContainers()

  // Count available containers by origin city (via route)
  const poolMap: Record<string, number> = {}
  containers.forEach((c) => {
    const route = getRouteById(c.routeId)
    const city = route?.originCity ?? "Khác"
    if (!poolMap[city]) poolMap[city] = 0
    if (c.currentPhase !== "in_transit" && c.currentPhase !== "at_border" && c.currentPhase !== "cleared_border") {
      poolMap[city] += 1
    }
  })

  // Build pools for cities we know coordinates for
  const pools = Object.entries(poolMap)
    .filter(([city]) => CITY_COORDS[city])
    .map(([city, count]) => ({ city, count, coords: CITY_COORDS[city] }))

  // Add some fixed showcase pools for visual richness
  const showcasePools = [
    { city: "Đà Nẵng", count: 8, coords: CITY_COORDS["Đà Nẵng"] },
    { city: "Khánh Hòa", count: 3, coords: CITY_COORDS["Khánh Hòa"] },
  ].filter((sp) => !pools.find((p) => p.city === sp.city))

  const allPools = [...pools, ...showcasePools]

  // Route lines from main origin cities to border
  const routeLines: [number, number][][] = allPools
    .filter((p) => p.count > 0)
    .map((p) => [p.coords, BORDER])

  return (
    <MapContainer
      center={[15.5, 107.5]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
      scrollWheelZoom={false}
      dragging={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="&copy; Esri"
      />

      {/* Route lines */}
      {routeLines.map((pts, i) => (
        <Polyline
          key={i}
          positions={pts}
          color="#34d399"
          weight={2}
          opacity={0.7}
          dashArray="8 5"
        />
      ))}

      {/* Pool markers */}
      {allPools.map((pool) => (
        <CircleMarker
          key={pool.city}
          center={pool.coords}
          radius={pool.count === 0 ? 6 : Math.max(8, Math.min(18, pool.count * 2.5))}
          fillColor={getColor(pool.count)}
          color="#ffffff"
          fillOpacity={0.9}
          weight={2}
          opacity={0.9}
        >
          <Tooltip direction="top" permanent={false}>
            <div style={{ fontSize: "11px", fontWeight: 600 }}>
              {pool.city}<br />
              <span style={{ color: getColor(pool.count) }}>{pool.count} cont available</span>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* Border crossing marker */}
      <CircleMarker
        center={BORDER}
        radius={8}
        fillColor="#a855f7"
        color="#ffffff"
        fillOpacity={0.95}
        weight={2.5}
        opacity={1}
      >
        <Tooltip direction="top" permanent={false}>
          <div style={{ fontSize: "11px", fontWeight: 600 }}>
            Cửa khẩu Hữu Nghị<br />
            <span style={{ color: "#a855f7" }}>Border crossing</span>
          </div>
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  )
}
