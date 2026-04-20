import { createClient } from "@supabase/supabase-js";

// Server-side client (uses service key — never expose to browser)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Helpers to convert DB rows ↔ app types
import type { Listing } from "./data";

export function dbToListing(row: Record<string, unknown>): Listing & { status?: string } {
  return {
    id: row.id as string,
    type: row.type as Listing["type"],
    title: row.title as string,
    description: (row.description as string) || "",
    city: (row.city as string) || "",
    address: (row.address as string) || "",
    pricePerDay: Number(row.price_per_day),
    pricePerMonth: row.price_per_month ? Number(row.price_per_month) : undefined,
    images: (row.images as string[]) || [],
    amenities: (row.amenities as string[]) || [],
    rating: Number(row.rating) || 8.5,
    reviewCount: Number(row.review_count) || 0,
    owner: (row.owner as Listing["owner"]) || { name: "", phone: "", avatar: "" },
    bedrooms: row.bedrooms ? Number(row.bedrooms) : undefined,
    bathrooms: row.bathrooms ? Number(row.bathrooms) : undefined,
    area: row.area ? Number(row.area) : undefined,
    brand: (row.brand as string) || undefined,
    model: (row.model as string) || undefined,
    year: row.year ? Number(row.year) : undefined,
    seats: row.seats ? Number(row.seats) : undefined,
    transmission: (row.transmission as string) || undefined,
    available: Boolean(row.available),
    deal: row.deal ? Number(row.deal) : undefined,
    verified: Boolean(row.verified),
    availableRooms: row.available_rooms ? Number(row.available_rooms) : undefined,
    lat: row.lat ? Number(row.lat) : undefined,
    lng: row.lng ? Number(row.lng) : undefined,
    policies: row.policies as Listing["policies"] | undefined,
    instantBook: Boolean(row.instant_book),
    usage: (row.usage as string) || undefined,
    priceUnit: (row.price_unit as "day" | "month") || undefined,
    status: (row.status as string) || "pending",
  };
}

export function listingToDb(l: Listing & { status?: string }) {
  return {
    id: l.id,
    type: l.type,
    title: l.title,
    description: l.description,
    city: l.city,
    address: l.address,
    price_per_day: l.pricePerDay,
    price_per_month: l.pricePerMonth ?? null,
    images: l.images,
    amenities: l.amenities,
    rating: l.rating,
    review_count: l.reviewCount,
    owner: l.owner,
    bedrooms: l.bedrooms ?? null,
    bathrooms: l.bathrooms ?? null,
    area: l.area ?? null,
    brand: l.brand ?? null,
    model: l.model ?? null,
    year: l.year ?? null,
    seats: l.seats ?? null,
    transmission: l.transmission ?? null,
    available: l.available,
    deal: l.deal ?? null,
    verified: l.verified ?? false,
    available_rooms: l.availableRooms ?? null,
    lat: l.lat ?? null,
    lng: l.lng ?? null,
    policies: l.policies ?? null,
    instant_book: l.instantBook ?? false,
    usage: l.usage ?? null,
    price_unit: l.priceUnit ?? null,
    status: l.status ?? "pending",
  };
}
