import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, differenceInDays, parseISO } from "date-fns"
import { vi } from "date-fns/locale"

// shadcn/ui utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== NUMBER & CURRENCY =====
export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function formatPercent(n: number, decimals = 1): string {
  return `${formatNumber(n, decimals)}%`
}

// ===== DATE & TIME =====
export function formatDate(iso: string): string {
  return format(parseISO(iso), "dd/MM/yyyy", { locale: vi })
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "HH:mm — dd/MM/yyyy", { locale: vi })
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: vi })
}

export function daysBetween(a: string, b: string): number {
  return differenceInDays(parseISO(b), parseISO(a))
}

// ===== ETA FORMATTING =====
export function formatHoursMinutes(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h} giờ ${m} phút`
}

export function formatEtaWithMargin(hours: number, marginMinutes: number): string {
  return `${formatHoursMinutes(hours)} ±${marginMinutes}p`
}

// ===== HELPERS =====
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ===== ID GENERATION =====
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}${random}`
}

// Container ID format: 4 chữ + 7 số (chuẩn ISO 6346 giả)
export function generateContainerId(): string {
  const prefixes = ["MSKU", "TCLU", "MEDU", "GESU", "FCIU", "TRIU"]
  const prefix = pickOne(prefixes)
  const num = randomInt(1000000, 9999999)
  return `${prefix} ${num}`
}

// ===== VALIDATION =====
export function isFutureDate(iso: string): boolean {
  return parseISO(iso) > new Date()
}

export function isPositiveNumber(n: number): boolean {
  return typeof n === "number" && n > 0 && !isNaN(n)
}

// ===== ARRAY =====
export function groupBy<T, K extends string | number>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function sortBy<T>(arr: T[], keyFn: (item: T) => number | string, desc = false): T[] {
  return [...arr].sort((a, b) => {
    const ka = keyFn(a)
    const kb = keyFn(b)
    if (ka < kb) return desc ? 1 : -1
    if (ka > kb) return desc ? -1 : 1
    return 0
  })
}
