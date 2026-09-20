"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X } from "lucide-react"

export interface ContainerFilterValues {
  routeId: string
  type: string
  availableForConsolidation: string
  maxPrice: string
}

const EMPTY: ContainerFilterValues = { routeId: "", type: "", availableForConsolidation: "", maxPrice: "" }

interface ContainerFilterProps {
  value: ContainerFilterValues
  onChange: (v: ContainerFilterValues) => void
}

export function ContainerFilter({ value, onChange }: ContainerFilterProps) {
  const hasFilter = Object.values(value).some(Boolean)

  return (
    <div className="flex flex-wrap items-end gap-3">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground self-center" />

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Tuyến đường</Label>
        <Select value={value.routeId} onValueChange={(v) => onChange({ ...value, routeId: v === "all" ? "" : v })}>
          <SelectTrigger className="h-8 w-48 text-sm">
            <SelectValue placeholder="Tất cả tuyến" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tuyến</SelectItem>
            <SelectItem value="route_daklak_langson">Đắk Lắk → Hữu Nghị</SelectItem>
            <SelectItem value="route_daklak_mongcai">Đắk Lắk → Móng Cái</SelectItem>
            <SelectItem value="route_tiengiang_langson">Tiền Giang → Hữu Nghị</SelectItem>
            <SelectItem value="route_hcm_langson">TP.HCM → Hữu Nghị</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Loại cont</Label>
        <Select value={value.type} onValueChange={(v) => onChange({ ...value, type: v === "all" ? "" : v })}>
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="reefer_20ft">Reefer 20ft</SelectItem>
            <SelectItem value="reefer_40ft">Reefer 40ft</SelectItem>
            <SelectItem value="reefer_40hc">Reefer 40HC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Hình thức</Label>
        <Select value={value.availableForConsolidation} onValueChange={(v) => onChange({ ...value, availableForConsolidation: v === "all" ? "" : v })}>
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="true">Cho ghép cont</SelectItem>
            <SelectItem value="false">Chỉ FCL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilter && (
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={() => onChange(EMPTY)}>
          <X className="h-3.5 w-3.5" /> Xoá filter
        </Button>
      )}
    </div>
  )
}
