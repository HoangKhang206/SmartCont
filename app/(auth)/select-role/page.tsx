"use client"

import { useRouter } from "next/navigation"
import { Warehouse, Truck, ArrowRight, Snowflake, CheckCircle2 } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

const roles: {
  role: UserRole
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  points: string[]
  accent: string
  bg: string
}[] = [
  {
    role: "shipper",
    icon: Warehouse,
    title: "Chủ vựa",
    subtitle: "Exporter — Xuất khẩu nông sản",
    description: "Vựa sầu riêng, xoài, thanh long quy mô 3–15 tấn/lô. Tìm cont, ghép cont, theo dõi hàng đến cửa khẩu.",
    points: [
      "Tạo lô hàng + tự tính RSL",
      "Book cont nguyên hoặc ghép cont",
      "Tracking real-time + AI ETA",
      "Đánh giá carrier sau chuyến",
    ],
    accent: "border-accent hover:border-accent",
    bg: "hover:bg-accent/5",
  },
  {
    role: "carrier",
    icon: Truck,
    title: "Bên vận chuyển",
    subtitle: "Carrier — Đơn vị xe reefer",
    description: "Công ty vận tải, forwarder sở hữu xe container lạnh. Publish chuyến, nhận booking, tối đa utilization.",
    points: [
      "Đăng cont/chuyến mới dễ dàng",
      "Nhận booking từ vựa tự động",
      "Cập nhật phase real-time",
      "Xem đánh giá và phản hồi",
    ],
    accent: "border-primary/30 hover:border-primary",
    bg: "hover:bg-primary/5",
  },
]

export default function SelectRolePage() {
  const router = useRouter()

  function handleSelectRole(role: UserRole) {
    router.push(`/select-user?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 h-14 flex items-center">
        <Logo size="md" href="/" />
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mb-4">
              <Snowflake className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Bạn là ai?</h1>
            <p className="text-sm text-muted-foreground">Chọn vai trò để vào đúng interface.</p>
          </div>

          {/* Role cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {roles.map(({ role, icon: Icon, title, subtitle, description, points, accent, bg }) => (
              <button
                key={role}
                onClick={() => handleSelectRole(role)}
                className={cn(
                  "text-left border-2 rounded-lg p-6 bg-card transition-all duration-150 group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  accent,
                  bg
                )}
              >
                {/* Icon + title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-muted group-hover:bg-accent/10 transition-colors">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-accent font-medium mt-0.5">{subtitle}</p>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

                <ul className="space-y-1.5">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo — không cần tài khoản thật. Chọn role rồi chọn người dùng mẫu.
          </p>
        </div>
      </div>
    </div>
  )
}
