"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { generateContainerId } from "@/lib/utils"
import { getRoutes } from "@/lib/data-store"

const schema = z.object({
  id: z.string().min(5, "Nhập số cont (VD: MSKU 1234567)"),
  type: z.string().min(1, "Chọn loại cont"),
  routeId: z.string().min(1, "Chọn tuyến đường"),
  departureDate: z.string().min(1, "Chọn ngày khởi hành"),
  temperatureSetpointC: z.coerce.number().min(-5).max(20),
  pricePerCubicMeter: z.coerce.number().positive("Nhập giá ghép cont"),
  priceForFullContainer: z.coerce.number().positive("Nhập giá nguyên cont"),
  availableForConsolidation: z.string(),
})

export type ContainerFormValues = z.infer<typeof schema>

interface ContainerFormProps {
  onSubmit: (values: ContainerFormValues) => void
  loading?: boolean
}

export function ContainerForm({ onSubmit, loading }: ContainerFormProps) {
  const routes = getRoutes()
  const form = useForm<ContainerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: generateContainerId(),
      type: "reefer_40hc",
      routeId: "",
      departureDate: "",
      temperatureSetpointC: 15,
      pricePerCubicMeter: 680000,
      priceForFullContainer: 46000000,
      availableForConsolidation: "true",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <FormField control={form.control} name="id" render={({ field }) => (
            <FormItem>
              <FormLabel>Số container</FormLabel>
              <FormControl>
                <Input placeholder="VD: MSKU 1234567" className="font-mono" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Định dạng chuẩn ISO 6346: 4 chữ + 7 số</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Loại container</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="reefer_20ft">Reefer 20ft — 28 m³</SelectItem>
                  <SelectItem value="reefer_40ft">Reefer 40ft — 58 m³</SelectItem>
                  <SelectItem value="reefer_40hc">Reefer 40ft HC — 67 m³</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="routeId" render={({ field }) => (
            <FormItem>
              <FormLabel>Tuyến đường</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Chọn tuyến..." /></SelectTrigger></FormControl>
                <SelectContent>
                  {routes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="departureDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày & giờ khởi hành</FormLabel>
              <FormControl><Input type="datetime-local" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="temperatureSetpointC" render={({ field }) => (
            <FormItem>
              <FormLabel>Nhiệt độ set-point (°C)</FormLabel>
              <FormControl><Input type="number" step="0.5" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="availableForConsolidation" render={({ field }) => (
            <FormItem>
              <FormLabel>Hình thức</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="true">Cho ghép cont (LCL)</SelectItem>
                  <SelectItem value="false">Chỉ nguyên cont (FCL)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="pricePerCubicMeter" render={({ field }) => (
            <FormItem>
              <FormLabel>Giá ghép cont (₫/m³)</FormLabel>
              <FormControl><Input type="number" step="10000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="priceForFullContainer" render={({ field }) => (
            <FormItem>
              <FormLabel>Giá nguyên cont (₫)</FormLabel>
              <FormControl><Input type="number" step="1000000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="min-w-36">
            {loading ? "Đang publish..." : "Publish chuyến"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
