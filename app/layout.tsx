import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "SmartDurian — Ghép cont lạnh thông minh cho SME nông sản",
  description:
    "Nền tảng booking và ghép container lạnh cho vựa nông sản xuất khẩu, tối ưu theo RSL và ETA dự báo động.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}
