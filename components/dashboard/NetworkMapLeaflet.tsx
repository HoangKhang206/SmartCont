"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet"
import L from "leaflet"

// ─────────────── Static data ───────────────
const POOLS = [
  { id: "danang",   name: "Đà Nẵng",   coords: [16.054, 108.202] as [number, number], count: 8, color: "#10b981", warning: false },
  { id: "quynhon",  name: "Quy Nhơn",  coords: [13.776, 109.224] as [number, number], count: 5, color: "#f59e0b", warning: false },
  { id: "khanhhoa", name: "Khánh Hòa", coords: [12.239, 109.197] as [number, number], count: 3, color: "#10b981", warning: false },
  { id: "daklak",   name: "Đắk Lắk",  coords: [12.700, 108.050] as [number, number], count: 0, color: "#ef4444", warning: true  },
]

// Curved container flow (planned, green solid)
const FLOW_ROUTES: [number, number][][] = [
  // Đắk Lắk → Đà Nẵng (swing east into sea)
  [[12.70, 108.05], [13.60, 110.50], [15.20, 111.00], [16.05, 108.20]],
  // Đắk Lắk → Quy Nhơn
  [[12.70, 108.05], [13.00, 110.10], [13.78, 109.22]],
  // Đắk Lắk → Khánh Hòa
  [[12.70, 108.05], [12.40, 110.00], [12.24, 109.20]],
]

// Repositioning flow (amber dashed) — slightly inland offset
const REPO_ROUTES: [number, number][][] = [
  [[16.05, 108.20], [14.80, 108.80], [13.30, 108.40], [12.70, 108.05]],
  [[13.78, 109.22], [13.20, 108.60], [12.70, 108.05]],
]

// Offshore shipping lane (white dashed)
const SHIPPING_LANE: [number, number][] = [
  [17.20, 110.80], [14.50, 113.00], [11.50, 112.50], [9.50, 110.80],
]

// Decorative ship positions (South China Sea)
const SHIP_MARKERS: { id: string; coords: [number, number] }[] = [
  { id: "ship1", coords: [15.20, 111.80] },
  { id: "ship2", coords: [12.10, 112.60] },
]

// ─────────────── Icon factories ───────────────
const SHIP_SVG = `<svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="12" width="28" height="7" rx="3" fill="white" stroke="#0f172a" stroke-width="1.5"/>
  <rect x="7"  y="6"  width="6"  height="6" rx="1" fill="white" stroke="#0f172a" stroke-width="1.5"/>
  <rect x="15" y="3"  width="5"  height="9" rx="1" fill="white" stroke="#0f172a" stroke-width="1.5"/>
  <path d="M1 19 L0 21 L30 21 L29 19" fill="white" stroke="#0f172a" stroke-width="1"/>
</svg>`

function createPillIcon(pool: typeof POOLS[0]): L.DivIcon {
  const { name, count, color, warning } = pool

  const pill = `
    <div style="
      background:white;border-radius:999px;
      padding:5px 12px 5px 8px;
      box-shadow:0 4px 16px rgba(0,0,0,0.35);
      display:flex;align-items:center;gap:7px;
      white-space:nowrap;border:1.5px solid ${color}55;
      font-family:system-ui,-apple-system,sans-serif;
    ">
      ${warning
        ? `<span style="font-size:13px;line-height:1;">⚠</span>`
        : `<span style="width:9px;height:9px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0;"></span>`
      }
      <span style="font-size:12px;font-weight:600;color:#0f172a;">${name}</span>
      <span style="
        background:${color}18;color:${color};
        font-size:10px;font-weight:700;
        padding:1px 6px;border-radius:4px;border:1px solid ${color}40;
      ">${count} cont</span>
    </div>
  `

  const html = warning ? `
    <div style="position:relative;display:inline-flex;align-items:center;justify-content:center;">
      <style>@keyframes sd-pulse{0%{transform:translate(-50%,-50%) scale(.7);opacity:.7}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}</style>
      <div style="position:absolute;top:50%;left:50%;width:50px;height:50px;border-radius:50%;background:#ef444428;animation:sd-pulse 1.6s ease-out infinite;pointer-events:none;"></div>
      <div style="position:absolute;top:50%;left:50%;width:34px;height:34px;border-radius:50%;border:2px solid #ef4444;animation:sd-pulse 1.6s ease-out .6s infinite;pointer-events:none;"></div>
      ${pill}
    </div>
  ` : pill

  return L.divIcon({
    className: "",
    html,
    iconSize: warning ? [175, 64] : [170, 36],
    iconAnchor: warning ? [87, 32] : [85, 18],
  })
}

function createShipIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="opacity:.85;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));">${SHIP_SVG}</div>`,
    iconSize: [30, 22],
    iconAnchor: [15, 11],
  })
}

// ─────────────── Capture map instance ───────────────
function MapInstanceCapture({ onMount }: { onMount: (m: L.Map) => void }) {
  const map = useMap()
  useEffect(() => { onMount(map) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

// ─────────────── Main component ───────────────
interface Props { mode?: "live" | "simulation" }

export default function NetworkMapLeaflet({ mode = "live" }: Props) {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [legendOpen, setLegendOpen] = useState(true)

  const shipIcon = createShipIcon()

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[14.5, 108.5]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© Esri"
        />

        {/* Container flow — green solid */}
        {FLOW_ROUTES.map((pts, i) => (
          <Polyline key={`flow-${i}`} positions={pts} color="#2ECC71" weight={3} opacity={0.95} />
        ))}

        {/* Repositioning — amber dashed */}
        {REPO_ROUTES.map((pts, i) => (
          <Polyline key={`repo-${i}`} positions={pts} color="#F39C12" weight={2} opacity={0.85} dashArray="8,4" />
        ))}

        {/* Shipping lane — white dashed */}
        <Polyline positions={SHIPPING_LANE} color="#ffffff" weight={2} opacity={0.55} dashArray="6,5" />

        {/* Pool markers */}
        {POOLS.map((pool) => (
          <Marker key={pool.id} position={pool.coords} icon={createPillIcon(pool)} />
        ))}

        {/* Decorative ship markers */}
        {SHIP_MARKERS.map((s) => (
          <Marker key={s.id} position={s.coords} icon={shipIcon} />
        ))}

        <MapInstanceCapture onMount={setMapInstance} />
      </MapContainer>

      {/* ── Legend overlay — top-left ── */}
      {legendOpen && (
        <div className="absolute top-3 left-3 z-[1000] bg-white rounded-xl shadow-lg p-3 min-w-[168px] select-none max-h-[calc(100%-24px)] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold text-gray-800 leading-none">Container Network</span>
            <button
              onClick={() => setLegendOpen(false)}
              className="ml-2 text-gray-400 hover:text-gray-600 leading-none"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Status */}
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
          {[
            { color: "#10b981", label: "Available (≥5)" },
            { color: "#f59e0b", label: "Limited (1–4)" },
            { color: "#ef4444", label: "Shortage (0)" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1">
              <span className="flex-shrink-0 h-2 w-2 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-gray-600">{label}</span>
            </div>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {/* Reefer pools */}
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Reefer Pools</p>
          {POOLS.map((p) => (
            <div key={p.id} className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                <span className="text-[10px] text-gray-600">{p.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-800 ml-4 tabular-nums">{p.count}</span>
            </div>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {/* Route legend */}
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Active Routes</p>
          <div className="flex items-center gap-2 mb-1.5">
            <svg width="22" height="6" className="flex-shrink-0">
              <line x1="0" y1="3" x2="22" y2="3" stroke="#2ECC71" strokeWidth="2.5"/>
            </svg>
            <span className="text-[10px] text-gray-600">Planned route</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="22" height="6" className="flex-shrink-0">
              <line x1="0" y1="3" x2="22" y2="3" stroke="#F39C12" strokeWidth="2" strokeDasharray="4,3"/>
            </svg>
            <span className="text-[10px] text-gray-600">Alternative route</span>
          </div>
        </div>
      )}

      {/* ── Route legend — bottom-right ── */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white rounded-lg shadow-md px-3 py-2 select-none">
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="22" height="8" className="flex-shrink-0">
            <defs><marker id="ah1" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#2ECC71"/></marker></defs>
            <line x1="0" y1="4" x2="18" y2="4" stroke="#2ECC71" strokeWidth="2.5" markerEnd="url(#ah1)"/>
          </svg>
          <span className="text-[9px] text-gray-600">Container flow</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="22" height="8" className="flex-shrink-0">
            <defs><marker id="ah2" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#F39C12"/></marker></defs>
            <line x1="0" y1="4" x2="18" y2="4" stroke="#F39C12" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#ah2)"/>
          </svg>
          <span className="text-[9px] text-gray-600">Repositioning</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="22" height="8" className="flex-shrink-0">
            <defs><marker id="ah3" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill="#94a3b8"/></marker></defs>
            <line x1="0" y1="4" x2="18" y2="4" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#ah3)"/>
          </svg>
          <span className="text-[9px] text-gray-600">Shipping lane</span>
        </div>
      </div>

      {/* ── Custom zoom controls — top-right ── */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => mapInstance?.zoomIn()}
          className="h-7 w-7 bg-white rounded-md shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-base leading-none"
          title="Zoom in"
        >+</button>
        <button
          onClick={() => mapInstance?.zoomOut()}
          className="h-7 w-7 bg-white rounded-md shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none"
          title="Zoom out"
        >−</button>
        <button
          className="h-7 w-7 bg-white rounded-md shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          title="Layers"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </button>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[999] text-[8px] text-white/40 pointer-events-none whitespace-nowrap">
        © Esri · World Imagery
      </div>

      {/* Simulation overlay */}
      {mode === "simulation" && (
        <div className="absolute inset-0 z-[999] pointer-events-none border-2 border-amber-400/60 rounded-xl">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Simulation mode
          </div>
        </div>
      )}
    </div>
  )
}
