"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"

interface BorderMarkerProps {
  position: [number, number]
  name: string
}

function makeBorderIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:30px;height:30px;
      background:#f59e0b;
      border:2px solid #fff;
      border-radius:6px;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
      font-size:15px;line-height:1;
    ">🚩</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  })
}

export function BorderMarker({ position, name }: BorderMarkerProps) {
  return (
    <Marker position={position} icon={makeBorderIcon()}>
      <Popup>
        <span className="text-sm font-medium">Cửa khẩu {name}</span>
      </Popup>
    </Marker>
  )
}
