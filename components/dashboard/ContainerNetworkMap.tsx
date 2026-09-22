"use client"

import dynamic from "next/dynamic"

const LeafletMap = dynamic(
  () => import("@/components/dashboard/NetworkMapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-[10px] text-muted-foreground">Đang tải bản đồ...</p>
        </div>
      </div>
    ),
  }
)

interface Props {
  mode?: "live" | "simulation"
}

export function ContainerNetworkMap({ mode = "live" }: Props) {
  return (
    <div className="h-full w-full">
      <LeafletMap mode={mode} />
    </div>
  )
}
