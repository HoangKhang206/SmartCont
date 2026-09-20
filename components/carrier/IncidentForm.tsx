"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { addIncident, addNotification, getBookings } from "@/lib/data-store"
import { generateId } from "@/lib/utils"
import type { IncidentType, IncidentSeverity } from "@/lib/types"

const schema = z.object({
  containerId: z.string().min(1),
  type: z.enum(["traffic_jam", "vehicle_breakdown", "temperature_deviation", "border_delay", "weather", "other"]),
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string().min(5, "Nhập tiêu đề sự cố (tối thiểu 5 ký tự)"),
  description: z.string().min(10, "Mô tả chi tiết hơn (tối thiểu 10 ký tự)"),
})

export type IncidentFormValues = z.infer<typeof schema>

interface IncidentFormProps {
  containerId: string
  reportedBy: string
  onSuccess?: () => void
}

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: "traffic_jam", label: "Tắc đường" },
  { value: "vehicle_breakdown", label: "Xe bị hỏng" },
  { value: "temperature_deviation", label: "Nhiệt độ lệch set-point" },
  { value: "border_delay", label: "Chậm trễ cửa khẩu" },
  { value: "weather", label: "Thời tiết" },
  { value: "other", label: "Khác" },
]

const SEVERITY_OPTIONS: { value: IncidentSeverity; label: string; color: string }[] = [
  { value: "info", label: "Thông tin", color: "text-muted-foreground" },
  { value: "warning", label: "Cảnh báo", color: "text-warning" },
  { value: "critical", label: "Nghiêm trọng", color: "text-danger" },
]

export function IncidentForm({ containerId, reportedBy, onSuccess }: IncidentFormProps) {
  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      containerId,
      type: "traffic_jam",
      severity: "warning",
      title: "",
      description: "",
    },
  })

  async function handleSubmit(values: IncidentFormValues) {
    await new Promise((r) => setTimeout(r, 600))

    const incidentId = generateId("inc")
    addIncident({
      id: incidentId,
      containerId: values.containerId,
      type: values.type as IncidentType,
      severity: values.severity as IncidentSeverity,
      title: values.title,
      description: values.description,
      reportedAt: new Date().toISOString(),
      reportedBy,
      resolved: false,
    })

    // Notify shippers
    const bookings = getBookings().filter((b) => b.containerId === values.containerId)
    bookings.forEach((b) => {
      addNotification({
        id: generateId("notif"),
        userId: b.shipperId,
        type: "incident",
        title: `Sự cố: ${values.title}`,
        message: `Cont ${values.containerId} — ${values.description.slice(0, 80)}`,
        containerId: values.containerId,
        read: false,
        createdAt: new Date().toISOString(),
      })
    })

    toast.success("Đã báo cáo sự cố!", {
      description: "Exporter đã được thông báo tự động.",
    })
    form.reset()
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Loại sự cố</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {INCIDENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="severity" render={({ field }) => (
            <FormItem>
              <FormLabel>Mức độ</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <span className={s.color}>{s.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Tiêu đề</FormLabel>
            <FormControl>
              <Input placeholder="VD: Xe bị thủng lốp tại Km 453 QL1A" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả chi tiết</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả sự cố, tình trạng hàng hóa, biện pháp xử lý..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting} variant="destructive" className="min-w-36">
            {form.formState.isSubmitting ? "Đang gửi..." : "Báo cáo sự cố"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
