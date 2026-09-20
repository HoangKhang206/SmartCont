"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type RouteMapType from "./RouteMap"

// Dynamic import so Leaflet only loads client-side (no SSR)
const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-lg border border-border bg-muted/50 animate-pulse flex items-center justify-center"
      style={{ height: "var(--preview-h, 200px)" }}
    >
      <span className="text-xs text-muted-foreground">Đang tải bản đồ...</span>
    </div>
  ),
})

type RouteMapProps = ComponentProps<typeof RouteMapType>

interface RouteMapPreviewProps extends RouteMapProps {
  /** Preset sizes */
  size?: "sm" | "md"
}

const sizeHeight: Record<"sm" | "md", string> = {
  sm: "180px",
  md: "260px",
}

export function RouteMapPreview({ size = "md", height, ...props }: RouteMapPreviewProps) {
  return (
    <RouteMap
      height={height ?? sizeHeight[size]}
      interactive={false}
      {...props}
    />
  )
}
