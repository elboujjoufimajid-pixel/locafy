import { listings as defaultListings, activities as defaultActivities } from "./data";
import type { Listing, Activity } from "./data";

// ─── Frontend-facing helpers (use localStorage if available) ─────────────────

export function getListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

export function filterListings(params: {
  type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Listing[] {
  return getListings().filter((l) => {
    if (params.type && params.type !== "all" && l.type !== params.type) return false;
    if (params.city && params.city !== "all" && l.city !== params.city) return false;
    if (params.minPrice && l.pricePerDay < params.minPrice) return false;
    if (params.maxPrice && l.pricePerDay > params.maxPrice) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      if (
        !l.title.toLowerCase().includes(q) &&
        !l.city.toLowerCase().includes(q) &&
        !l.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function getActivityById(id: string): Activity | undefined {
  return getActivities().find((a) => a.id === id);
}

export function filterActivities(params: {
  category?: string;
  city?: string;
  search?: string;
}): Activity[] {
  return getActivities().filter((a) => {
    if (params.category && params.category !== "all" && a.category !== params.category) return false;
    if (params.city && params.city !== "all" && a.city !== params.city) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      if (
        !a.title.toLowerCase().includes(q) &&
        !a.city.toLowerCase().includes(q) &&
        !a.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

const LISTINGS_KEY = "Rachra_listings";
const ACTIVITIES_KEY = "Rachra_activities";

// ─── Listings ────────────────────────────────────────────────
export function getListings(): Listing[] {
  if (typeof window === "undefined") return defaultListings;
  const s = localStorage.getItem(LISTINGS_KEY);
  return s ? JSON.parse(s) : defaultListings;
}
export function saveListing(listing: Listing) {
  const all = getListings();
  const idx = all.findIndex((l) => l.id === listing.id);
  if (idx >= 0) all[idx] = listing;
  else all.unshift(listing);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all));
}
export function deleteListing(id: string) {
  const all = getListings().filter((l) => l.id !== id);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all));
}

// ─── Activities ───────────────────────────────────────────────
export function getActivities(): Activity[] {
  if (typeof window === "undefined") return defaultActivities;
  const s = localStorage.getItem(ACTIVITIES_KEY);
  return s ? JSON.parse(s) : defaultActivities;
}
export function saveActivity(activity: Activity) {
  const all = getActivities();
  const idx = all.findIndex((a) => a.id === activity.id);
  if (idx >= 0) all[idx] = activity;
  else all.unshift(activity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(all));
}
export function deleteActivity(id: string) {
  const all = getActivities().filter((a) => a.id !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(all));
}

// ─── Mock reservations ────────────────────────────────────────
export type ReservationStatus = "confirmed" | "pending" | "cancelled";
export interface Reservation {
  id: string;
  listingTitle: string;
  listingImage?: string;
  listingCity?: string;
  type: "listing" | "activity";
  guest: string;
  guestEmail?: string;
  phone: string;
  startDate: string;
  endDate: string;
  total: number;
  status: ReservationStatus;
}

const RES_KEY = "Rachra_reservations";

const defaultReservations: Reservation[] = [
  { id: "R001", listingTitle: "Appartement Moderne Centre Oujda", type: "listing", guest: "Youssef Amrani", phone: "0661234000", startDate: "2026-04-15", endDate: "2026-04-20", total: 1750, status: "confirmed" },
  { id: "R002", listingTitle: "Villa Spacieuse avec Piscine — Berkane", type: "listing", guest: "Fatima Zahra", phone: "0662345001", startDate: "2026-04-22", endDate: "2026-04-27", total: 4000, status: "pending" },
  { id: "R003", listingTitle: "Dacia Logan 2022 — Automatique", type: "listing", guest: "Hassan Oulad", phone: "0663456002", startDate: "2026-04-18", endDate: "2026-04-21", total: 750, status: "confirmed" },
  { id: "R004", listingTitle: "Balade Quad & ATV — Pistes d'Oujda", type: "activity", guest: "Sara Benmoussa", phone: "0664567003", startDate: "2026-05-01", endDate: "2026-05-01", total: 540, status: "pending" },
  { id: "R005", listingTitle: "Restaurant Al Andalous — Oujda", type: "activity", guest: "Omar Tazi", phone: "0665678004", startDate: "2026-04-12", endDate: "2026-04-12", total: 480, status: "confirmed" },
  { id: "R006", listingTitle: "Studio Meublé Nador Plage", type: "listing", guest: "Karim Idrissi", phone: "0666789005", startDate: "2026-04-08", endDate: "2026-04-10", total: 525, status: "cancelled" },
];

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return defaultReservations;
  const s = localStorage.getItem(RES_KEY);
  return s ? JSON.parse(s) : defaultReservations;
}
export function addReservation(res: Omit<Reservation, "id" | "status">): Reservation {
  const newRes: Reservation = { ...res, id: `RES-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, status: "pending" };
  const all = getReservations();
  all.unshift(newRes);
  if (typeof window !== "undefined") localStorage.setItem(RES_KEY, JSON.stringify(all));
  return newRes;
}
export function updateReservationStatus(id: string, status: ReservationStatus) {
  const all = getReservations();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) all[idx].status = status;
  localStorage.setItem(RES_KEY, JSON.stringify(all));
}
export function getUserReservations(email: string): Reservation[] {
  return getReservations().filter((r) => r.guestEmail === email);
}
