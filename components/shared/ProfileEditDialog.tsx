"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { updateCurrentUserProfile } from "@/lib/data-store"
import type { User } from "@/lib/types"

const schema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").max(15).or(z.literal("")),
  location: z.string(),
})
type FormValues = z.infer<typeof schema>

interface ProfileEditDialogProps {
  user: User
  open: boolean
  onClose: () => void
  onUpdated: (updated: User) => void
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join("")
}

export function ProfileEditDialog({ user, open, onClose, onUpdated }: ProfileEditDialogProps) {
  const [saving, setSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      location: user.location ?? "",
    },
  })

  async function handleSubmit(values: FormValues) {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    const updates = {
      name: values.name,
      phone: values.phone || user.phone,
      location: values.location || undefined,
    }
    updateCurrentUserProfile(updates)
    onUpdated({ ...user, ...updates })
    toast.success("Đã cập nhật hồ sơ!")
    setSaving(false)
    onClose()
  }

  const roleLabel = user.role === "shipper" ? "Chủ vựa" : "Bên vận chuyển"

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
            <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl><Input type="tel" placeholder="0912 345 678" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem>
                <FormLabel>{user.role === "shipper" ? "Vựa / Khu vực" : "Tỉnh / Thành phố"}</FormLabel>
                <FormControl><Input placeholder="VD: Krông Pắc, Đắk Lắk" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
                Huỷ
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
