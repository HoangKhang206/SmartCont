"use client"

import { Marker, Tooltip } from "react-leaflet"
import L from "leaflet"

interface ContainerMarkerProps {
  position: [number, number]
  containerId: string
  heading?: number
}

function makeContainerIcon(heading: number) {
  // Arrow points north (up) by default; rotate to match heading
  const rot = Math.round(heading)
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:36px;height:36px;
        display:flex;align-items:center;justify-content:center;
        transform:rotate(${rot}deg);
      ">
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <!-- shadow circle -->
          <circle cx="18" cy="18" r="16" fill="rgba(0,0,0,0.15)" transform="translate(1,1)"/>
          <!-- main circle -->
          <circle cx="18" cy="18" r="16" fill="#0ea5e9" stroke="white" stroke-width="2"/>
          <!-- truck body (points upward = north) -->
          <g transform="translate(18,18) rotate(0)" fill="white">
            <!-- cab -->
            <rect x="-5" y="-12" width="10" height="7" rx="2"/>
            <!-- arrow head pointing north -->
            <polygon points="0,-14 4,-8 -4,-8"/>
            <!-- container body -->
            <rect x="-5" y="-5" width="10" height="12" rx="1"/>
          </g>
        </svg>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    tooltipAnchor: [18, 0],
  })
}

export function ContainerMarker({ position, containerId, heading = 0 }: ContainerMarkerProps) {
  return (
    <Marker position={position} icon={makeContainerIcon(heading)}>
      <Tooltip permanent={false} direction="top">
        <span className="font-mono text-xs">{containerId}</span>
      </Tooltip>
    </Marker>
  )
}
