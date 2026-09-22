"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import { ContainerMarker } from "./ContainerMarker"
import { BorderMarker } from "./BorderMarker"
import { cn } from "@/lib/utils"
import type { Route, ContainerPhase, GPSPosition } from "@/lib/types"

// ── helpers ──────────────────────────────────────────────────────────────────

const PHASE_PROGRESS: Record<ContainerPhase, number> = {
  booked: 0,
  en_route_to_warehouse: 0.06,
  at_warehouse: 0.10,
  loading: 0.13,
  in_transit: 0.55,
  at_border: 0.88,
  customs_clearance: 0.91,
  cleared_border: 0.94,
  at_destination: 0.97,
  delivered: 1.0,
}

function interpolateOnRoute(pts: [number, number][], t: number): [number, number] {
  if (t <= 0) return pts[0]
  if (t >= 1) return pts[pts.length - 1]
  const segs: number[] = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    segs.push(d)
    total += d
  }
  let target = t * total
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const p = target / segs[i]
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * p,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * p,
      ]
    }
    target -= segs[i]
  }
  return pts[pts.length - 1]
}

function getHeading(pts: [number, number][], t: number): number {
  const p1 = interpolateOnRoute(pts, Math.max(0, t - 0.03))
  const p2 = interpolateOnRoute(pts, Math.min(1, t + 0.03))
  const deg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI)
  // Convert math angle (east=0) to compass bearing (north=0, clockwise)
  return (90 - deg + 360) % 360
}

function makeOriginIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:10px;height:10px;
      background:#10b981;
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,.3);
    "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
}

function makeCurrentPositionIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:18px;height:18px;
      background:#ef4444;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(239,68,68,.5);
      position:relative;
    ">
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:6px;height:6px;
        background:white;border-radius:50%;
      "></div>
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

// Fits the map to the route bounds after mount
function FitBounds({ waypoints }: { waypoints: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (!waypoints.length) return
    const bounds = L.latLngBounds(waypoints)
    map.fitBounds(bounds, { padding: [28, 28] })
  }, [map]) // intentionally omit waypoints — run once after mount
  return null
}

// ── component ─────────────────────────────────────────────────────────────────

interface RouteMapProps {
  route: Route
  currentPhase?: ContainerPhase
  currentPosition?: GPSPosition
  containerId?: string
  height?: string
  interactive?: boolean
  className?: string
}

export default function RouteMap({
  route,
  currentPhase = "booked",
  currentPosition,
  containerId,
  height = "380px",
  interactive = true,
  className,
}: RouteMapProps) {
  const pts = route.waypoints as [number, number][]
  const progress = PHASE_PROGRESS[currentPhase] ?? 0
  const containerPos: [number, number] = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : interpolateOnRoute(pts, progress)
  const heading = currentPosition?.heading ?? getHeading(pts, progress)
  const center: [number, number] = pts[Math.floor(pts.length / 2)]
  const showContainerMarker = currentPhase !== "booked" && currentPhase !== "delivered"
  const showPositionDot = currentPhase === "booked"

  return (
    <div className={cn("rounded-lg overflow-hidden border border-border relative isolate", className)} style={{ height }}>
      <MapContainer
        key={route.id}
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        attributionControl={interactive}
      >
        <FitBounds waypoints={pts} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
        />

        {/* Route polyline */}
        <Polyline
          positions={pts}
          color="#0ea5e9"
          weight={interactive ? 3.5 : 2.5}
          opacity={0.75}
        />

        {/* Origin marker */}
        <Marker position={pts[0]} icon={makeOriginIcon()}>
          <Tooltip direction="right">{route.originCity}</Tooltip>
        </Marker>

        {/* Border crossing marker */}
        <BorderMarker
          position={route.destinationCoords as [number, number]}
          name={route.borderCrossing}
        />

        {/* Red dot — container at origin (booked, not yet departed) */}
        {showPositionDot && (
          <Marker position={pts[0]} icon={makeCurrentPositionIcon()}>
            <Tooltip direction="top" permanent={false}>Cont đang tại đây</Tooltip>
          </Marker>
        )}

        {/* Truck marker — container in motion */}
        {showContainerMarker && (
          <ContainerMarker
            position={containerPos}
            containerId={containerId ?? ""}
            heading={heading}
          />
        )}
      </MapContainer>
    </div>
  )
}
