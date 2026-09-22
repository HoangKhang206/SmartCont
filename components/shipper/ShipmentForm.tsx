"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculateRSL } from "@/lib/fake-ai"
import { PRODUCTS } from "@/lib/constants"

const MATURITY_OPTIONS = [
  { value: 1, label: "1 — Xanh non" },
  { value: 2, label: "2 — Xanh chín" },
  { value: 3, label: "3 — Chín thương mại (khuyến nghị)" },
  { value: 4, label: "4 — Chín kỹ" },
  { value: 5, label: "5 — Chín hoàn toàn" },
]

const DURIAN_TYPES = ["durian_ri6", "durian_monthong", "durian_other"]

const schema = z.object({
  productType: z.string().min(1, "Chọn loại nông sản"),
  weightKg: z.coerce.number().positive("Khối lượng phải lớn hơn 0"),
  volumeM3: z.coerce.number().positive("Thể tích phải lớn hơn 0"),
  harvestDate: z.string().min(1, "Chọn ngày cắt"),
  daa: z.coerce.number().min(1, "DAA phải lớn hơn 0").max(200, "DAA tối đa 200 ngày"),
  maturityScore: z.coerce.number().min(1).max(5),
  temperatureRequiredC: z.coerce.number().min(-5).max(20, "Nhiệt độ -5 đến 20°C"),
  originAddress: z.string().min(3, "Nhập địa chỉ"),
  originCity: z.string().min(1, "Nhập tỉnh/thành"),
  destinationBorder: z.string().min(1, "Chọn cửa khẩu"),
  destination: z.string().min(1, "Chọn điểm đến"),
  deadlineDate: z.string().min(1, "Chọn deadline"),
  growingAreaCode: z.string().optional(),
  packingFacilityCode: z.string().optional(),
})

export type ShipmentFormValues = z.infer<typeof schema>

interface ShipmentFormProps {
  onSubmit: (values: ShipmentFormValues, rsl: number) => void
  loading?: boolean
}

export function ShipmentForm({ onSubmit, loading }: ShipmentFormProps) {
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productType: "",
      weightKg: undefined,
      volumeM3: undefined,
      harvestDate: "",
      daa: undefined,
      maturityScore: 3,
      temperatureRequiredC: 15,
      originAddress: "",
      originCity: "",
      destinationBorder: "Hữu Nghị",
      destination: "Bằng Tường, Quảng Tây",
      deadlineDate: "",
      growingAreaCode: "",
      packingFacilityCode: "",
    },
  })

  const watchedProduct = form.watch("productType")
  const isDurian = DURIAN_TYPES.includes(watchedProduct)

  function handleSubmit(values: ShipmentFormValues) {
    const rsl = calculateRSL(
      values.productType as never,
      values.harvestDate,
      values.daa,
      values.maturityScore,
      values.temperatureRequiredC,
    )
    onSubmit(values, rsl)
  }

  const borderOptions = [
    { value: "Hữu Nghị", dest: "Bằng Tường, Quảng Tây" },
    { value: "Móng Cái", dest: "Đông Hưng, Quảng Tây" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <FormField control={form.control} name="productType" render={({ field }) => (
            <FormItem>
              <FormLabel>Loại nông sản</FormLabel>
              <Select onValueChange={(v) => {
                field.onChange(v)
                const product = PRODUCTS[v as keyof typeof PRODUCTS]
                if (product) form.setValue("temperatureRequiredC", product.optimalTempC)
              }} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Chọn sản phẩm..." /></SelectTrigger></FormControl>
                <SelectContent>
                  {Object.values(PRODUCTS).map((p) => (
                    <SelectItem key={p.code} value={p.code}>{p.nameVi}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="harvestDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày cắt / thu hoạch</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="daa" render={({ field }) => (
            <FormItem>
              <FormLabel>DAA — Ngày sau ra hoa</FormLabel>
              <FormControl><Input type="number" placeholder="VD: 108" {...field} /></FormControl>
              <FormDescription className="text-[11px]">Days After Anthesis — số ngày từ khi ra hoa đến khi cắt</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="maturityScore" render={({ field }) => (
            <FormItem>
              <FormLabel>Độ chín (1–5)</FormLabel>
              <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {MATURITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="weightKg" render={({ field }) => (
            <FormItem>
              <FormLabel>Khối lượng (kg)</FormLabel>
              <FormControl><Input type="number" placeholder="VD: 4000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="volumeM3" render={({ field }) => (
            <FormItem>
              <FormLabel>Thể tích (m³)</FormLabel>
              <FormControl><Input type="number" step="0.1" placeholder="VD: 6.5" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="temperatureRequiredC" render={({ field }) => (
            <FormItem>
              <FormLabel>Nhiệt độ bảo quản (°C)</FormLabel>
              <FormControl><Input type="number" step="0.5" placeholder="VD: 15" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="originAddress" render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ vựa</FormLabel>
              <FormControl><Input placeholder="VD: Ấp 5, Xã Ea Yông..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="originCity" render={({ field }) => (
            <FormItem>
              <FormLabel>Tỉnh/Thành</FormLabel>
              <FormControl><Input placeholder="VD: Krông Pắc, Đắk Lắk" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="destinationBorder" render={({ field }) => (
            <FormItem>
              <FormLabel>Cửa khẩu</FormLabel>
              <Select onValueChange={(v) => {
                field.onChange(v)
                const opt = borderOptions.find((b) => b.value === v)
                if (opt) form.setValue("destination", opt.dest)
              }} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {borderOptions.map((b) => (
                    <SelectItem key={b.value} value={b.value}>{b.value} — {b.dest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="deadlineDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline giao hàng</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Durian export compliance — Cục BVTV */}
        {isDurian && (
          <div className="rounded-md border border-accent/30 bg-accent/5 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Mã kiểm dịch xuất khẩu TQ</p>
              <Badge variant="outline" className="text-[10px] border-accent/40 text-accent">Bắt buộc theo Cục BVTV</Badge>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Sầu riêng xuất Trung Quốc phải có mã số vùng trồng và cơ sở đóng gói được Cục Bảo vệ Thực vật cấp phép.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="growingAreaCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã số vùng trồng</FormLabel>
                  <FormControl><Input placeholder="VD: DL-0001-2024" {...field} /></FormControl>
                  <FormDescription className="text-[11px]">Do Cục BVTV / Chi cục địa phương cấp</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="packingFacilityCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã số cơ sở đóng gói</FormLabel>
                  <FormControl><Input placeholder="VD: CS-DL-0042" {...field} /></FormControl>
                  <FormDescription className="text-[11px]">Cơ sở đóng gói được Cục BVTV kiểm tra, cấp phép</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="min-w-32">
            {loading ? "Đang tạo..." : "Tạo lô hàng"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
