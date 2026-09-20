import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  homeHref?: string
  className?: string
}

export function ErrorState({
  title = "Không tải được dữ liệu",
  description = "Kiểm tra kết nối mạng và thử lại.",
  onRetry,
  homeHref,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 mb-4">
        <AlertCircle className="h-7 w-7 text-danger" />
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        )}
        {homeHref && (
          <Button variant="outline" size="sm" asChild>
            <a href={homeHref}>Về trang chủ</a>
          </Button>
        )}
      </div>
    </div>
  )
}
