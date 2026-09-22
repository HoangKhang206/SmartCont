/**
 * Data store — đọc seed data ban đầu, persist thay đổi vào localStorage.
 */

import type {
  Container,
  Shipment,
  Route,
  Rating,
  User,
  Booking,
  Notification,
  Incident,
} from "./types"

// Seed data
import containersData from "@/data/containers.json"
import shipmentsData from "@/data/shipments.json"
import routesData from "@/data/routes.json"
import ratingsData from "@/data/ratings.json"
import usersData from "@/data/users.json"
import bookingsData from "@/data/bookings.json"
import notificationsData from "@/data/notifications.json"

const STORAGE_PREFIX = "smartcont:"
const STORAGE_KEYS = {
  containers: `${STORAGE_PREFIX}containers`,
  shipments: `${STORAGE_PREFIX}shipments`,
  ratings: `${STORAGE_PREFIX}ratings`,
  bookings: `${STORAGE_PREFIX}bookings`,
  notifications: `${STORAGE_PREFIX}notifications`,
  incidents: `${STORAGE_PREFIX}incidents`,
  currentUser: `${STORAGE_PREFIX}currentUser`,
  customUsers: `${STORAGE_PREFIX}customUsers`,
}

// ===== SSR GUARD =====
function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    // silent fail
  }
}

// ===== CONTAINERS =====
export function getContainers(): Container[] {
  const stored = loadFromStorage<Container[]>(STORAGE_KEYS.containers, [])
  if (stored.length === 0) return containersData as Container[]
  // Merge: prepend any seed containers not yet in localStorage
  const storedIds = new Set(stored.map((c) => c.id))
  const newFromSeed = (containersData as Container[]).filter((c) => !storedIds.has(c.id))
  return newFromSeed.length > 0 ? [...newFromSeed, ...stored] : stored
}

export function saveContainer(container: Container): void {
  const list = getContainers()
  const idx = list.findIndex((c) => c.id === container.id)
  if (idx >= 0) list[idx] = container
  else list.push(container)
  saveToStorage(STORAGE_KEYS.containers, list)
}

export function getContainerById(id: string): Container | undefined {
  return getContainers().find((c) => c.id === id)
}

// ===== SHIPMENTS =====
export function getShipments(): Shipment[] {
  return loadFromStorage(STORAGE_KEYS.shipments, shipmentsData as Shipment[])
}

export function saveShipment(shipment: Shipment): void {
  const list = getShipments()
  const idx = list.findIndex((s) => s.id === shipment.id)
  if (idx >= 0) list[idx] = shipment
  else list.push(shipment)
  saveToStorage(STORAGE_KEYS.shipments, list)
}

export function getShipmentsByShipperId(shipperId: string): Shipment[] {
  return getShipments().filter((s) => s.shipperId === shipperId)
}

// ===== ROUTES (static, không cần persist) =====
export function getRoutes(): Route[] {
  return routesData as Route[]
}

export function getRouteById(id: string): Route | undefined {
  return getRoutes().find((r) => r.id === id)
}

// ===== RATINGS =====
export function getRatings(): Rating[] {
  return loadFromStorage(STORAGE_KEYS.ratings, ratingsData as Rating[])
}

export function saveRating(rating: Rating): void {
  const list = getRatings()
  list.push(rating)
  saveToStorage(STORAGE_KEYS.ratings, list)
}

export function getRatingsByCarrierId(carrierId: string): Rating[] {
  return getRatings().filter((r) => r.carrierId === carrierId)
}

// ===== BOOKINGS =====
export function getBookings(): Booking[] {
  return loadFromStorage(STORAGE_KEYS.bookings, bookingsData as Booking[])
}

export function saveBooking(booking: Booking): void {
  const list = getBookings()
  const idx = list.findIndex((b) => b.id === booking.id)
  if (idx >= 0) list[idx] = booking
  else list.push(booking)
  saveToStorage(STORAGE_KEYS.bookings, list)
}

// ===== USERS =====
export function getUsers(): User[] {
  const custom = loadFromStorage<User[]>(STORAGE_KEYS.customUsers, [])
  return [...(usersData as User[]), ...custom]
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id)
}

export function saveCustomUser(user: User): void {
  const list = loadFromStorage<User[]>(STORAGE_KEYS.customUsers, [])
  const idx = list.findIndex((u) => u.id === user.id)
  if (idx >= 0) list[idx] = user
  else list.push(user)
  saveToStorage(STORAGE_KEYS.customUsers, list)
}

// ===== CURRENT USER (session) =====
export function getCurrentUser(): User | null {
  return loadFromStorage<User | null>(STORAGE_KEYS.currentUser, null)
}

export function setCurrentUser(user: User | null): void {
  saveToStorage(STORAGE_KEYS.currentUser, user)
}

export function logout(): void {
  saveToStorage(STORAGE_KEYS.currentUser, null)
}

export function updateCurrentUserProfile(updates: Partial<Pick<User, "name" | "phone" | "location">>): void {
  const current = getCurrentUser()
  if (!current) return
  const updated = { ...current, ...updates }
  setCurrentUser(updated)
  // Also update in customUsers list if this is a registered user
  const customList = loadFromStorage<User[]>(STORAGE_KEYS.customUsers, [])
  const idx = customList.findIndex((u) => u.id === current.id)
  if (idx !== -1) {
    customList[idx] = updated
    saveToStorage(STORAGE_KEYS.customUsers, customList)
  }
}

// ===== CARRIER SETTINGS =====
export function getCarrierAutoConfirm(carrierId: string): boolean {
  if (!isBrowser()) return true
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}carrier_settings:${carrierId}`)
    if (!raw) return true
    return (JSON.parse(raw) as { autoConfirm: boolean }).autoConfirm ?? true
  } catch {
    return true
  }
}

export function setCarrierAutoConfirm(carrierId: string, value: boolean): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(`${STORAGE_PREFIX}carrier_settings:${carrierId}`, JSON.stringify({ autoConfirm: value }))
  } catch {
    // silent fail
  }
}

// ===== NOTIFICATIONS =====
export function getNotifications(userId: string): Notification[] {
  const stored = loadFromStorage<Notification[]>(STORAGE_KEYS.notifications, [])
  const base = stored.length > 0 ? stored : (notificationsData as Notification[])
  return base.filter((n) => n.userId === userId).slice(0, 50)
}

export function addNotification(notification: Notification): void {
  const stored = loadFromStorage<Notification[]>(STORAGE_KEYS.notifications, [])
  const base = stored.length > 0 ? stored : (notificationsData as Notification[])
  base.unshift(notification)
  saveToStorage(STORAGE_KEYS.notifications, base.slice(0, 100))
}

export function markNotificationRead(id: string): void {
  const all = loadFromStorage<Notification[]>(STORAGE_KEYS.notifications, [])
  const n = all.find((x) => x.id === id)
  if (n) n.read = true
  saveToStorage(STORAGE_KEYS.notifications, all)
}

export function markAllNotificationsRead(userId: string): void {
  const all = loadFromStorage<Notification[]>(STORAGE_KEYS.notifications, [])
  all.forEach((n) => { if (n.userId === userId) n.read = true })
  saveToStorage(STORAGE_KEYS.notifications, all)
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length
}

// ===== INCIDENTS =====
export function getIncidents(): Incident[] {
  return loadFromStorage<Incident[]>(STORAGE_KEYS.incidents, [])
}

export function addIncident(incident: Incident): void {
  const list = getIncidents()
  list.unshift(incident)
  saveToStorage(STORAGE_KEYS.incidents, list)
}

// ===== RESET (dùng khi cần restart demo) =====
export function resetDemoData(): void {
  if (!isBrowser()) return
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}
