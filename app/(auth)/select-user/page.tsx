"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, MapPin, Phone, ArrowRight, CheckCircle2, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Logo } from "@/components/shared/Logo"
import { cn, generateId } from "@/lib/utils"
import { getUsers, setCurrentUser, saveCustomUser } from "@/lib/data-store"
import type { User, UserRole } from "@/lib/types"

const registerSchema = z.object({
  name: z.string().min(2, "Nhập họ tên đầy đủ (ít nhất 2 ký tự)"),
  phone: z.string().min(9, "Nhập số điện thoại hợp lệ").max(15),
  location: z.string().min(3, "Nhập tỉnh / thành phố / khu vực"),
})
type RegisterValues = z.infer<typeof registerSchema>

const roleLabel: Record<UserRole, string> = {
  shipper: "Doanh nghiệp",
  carrier: "Bên vận chuyển",
}

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join("")
}

// ── Existing accounts tab ─────────────────────────────────────────────────────

function ExistingAccounts({ role, onLogin }: { role: UserRole; onLogin: (u: User) => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUsers(getUsers().filter((u) => u.role === role))
  }, [role])

  async function handleSelect(user: User) {
    setSelected(user.id)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    onLogin(user)
  }

  return (
    <div className="space-y-3">
      {users.map((user) => {
        const isSelected = selected === user.id
        return (
          <button
            key={user.id}
            onClick={() => !loading && handleSelect(user)}
            disabled={loading}
            className={cn(
              "w-full text-left border rounded-lg px-4 py-3.5 bg-card transition-all duration-150 group",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-accent bg-accent/5 shadow-sm"
                : "border-border hover:border-accent/50 hover:bg-muted/30",
              loading && !isSelected && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{user.name}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  {user.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </span>
                  )}
                  {user.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {isSelected && loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                ) : isSelected ? (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Register tab ──────────────────────────────────────────────────────────────

function RegisterForm({ role, onLogin }: { role: UserRole; onLogin: (u: User) => void }) {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", phone: "", location: "" },
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(values: RegisterValues) {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))

    const seed = encodeURIComponent(values.name)
    const newUser: User = {
      id: generateId("user"),
      role,
      name: values.name,
      phone: values.phone,
      location: values.location,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`,
    }

    saveCustomUser(newUser)
    onLogin(newUser)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Họ và tên</FormLabel>
            <FormControl>
              <Input placeholder={role === "shipper" ? "VD: Trần Văn Minh" : "VD: Công ty vận tải Minh Hùng"} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>Số điện thoại</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="0912 345 678" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>{role === "shipper" ? "Vựa / Khu vực sản xuất" : "Tỉnh / Thành phố"}</FormLabel>
            <FormControl>
              <Input placeholder={role === "shipper" ? "VD: Krông Pắc, Đắk Lắk" : "VD: TP. Hồ Chí Minh"} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full gap-2" disabled={submitting}>
          {submitting ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Tạo tài khoản & đăng nhập
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Tài khoản được lưu trên thiết bị này · Không yêu cầu mật khẩu
        </p>
      </form>
    </Form>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

function SelectUserContent() {
  const router = useRouter()
  const params = useSearchParams()
  const role = params.get("role") as UserRole | null

  useEffect(() => {
    if (!role || (role !== "shipper" && role !== "carrier")) {
      router.replace("/select-role")
    }
  }, [role, router])

  function handleLogin(user: User) {
    setCurrentUser(user)
    router.push(`/${user.role}/dashboard`)
  }

  if (!role) return null

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-7">
          <p className="text-xs font-medium text-accent mb-2 uppercase tracking-wider">
            {roleLabel[role]}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
        </div>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="existing">Tài khoản có sẵn</TabsTrigger>
            <TabsTrigger value="register">Đăng ký mới</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-0">
            <ExistingAccounts role={role} onLogin={handleLogin} />
            <p className="text-center text-xs text-muted-foreground mt-5">
              Tài khoản mẫu · Dùng để trải nghiệm demo
            </p>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <div className="border border-border rounded-lg p-5 bg-card">
              <RegisterForm role={role} onLogin={handleLogin} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function SelectUserPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 h-14 flex items-center justify-between">
        <Logo size="md" href="/" />
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => router.push("/select-role")}
        >
          <ArrowLeft className="h-4 w-4" />
          Đổi vai trò
        </Button>
      </header>

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        }
      >
        <SelectUserContent />
      </Suspense>
    </div>
  )
}
