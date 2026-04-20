import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { activities as defaultActivities } from "@/lib/data";
import type { Activity } from "@/lib/data";

function dbToActivity(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    category: (row.category as Activity["category"]) || "outdoor",
    title: row.title as string,
    description: (row.description as string) || "",
    city: (row.city as string) || "",
    address: (row.location as string) || "",
    pricePerPerson: Number(row.price_per_person),
    duration: (row.duration as string) || "",
    images: (row.images as string[]) || [],
    included: (row.included as string[]) || [],
    rating: Number(row.rating) || 8.5,
    reviewCount: Number(row.review_count) || 0,
    owner: (row.owner as Activity["owner"]) || { name: "", phone: "", avatar: "" },
    minPersons: Number(row.min_persons) || 1,
    maxPersons: Number(row.max_persons) || 10,
    available: Boolean(row.available),
    deal: row.deal ? Number(row.deal) : undefined,
    verified: Boolean(row.verified),
    idealFor: (row.ideal_for as Activity["idealFor"]) || [],
    cuisine: (row.cuisine as string) || undefined,
    schedule: (row.schedule as string) || undefined,
  };
}

function activityToDb(a: Activity & { status?: string }) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    category: a.category,
    city: a.city,
    location: a.address,
    price_per_person: a.pricePerPerson,
    duration: a.duration,
    images: a.images,
    included: a.included || [],
    rating: a.rating,
    review_count: a.reviewCount,
    owner: a.owner,
    min_persons: a.minPersons || 1,
    max_persons: a.maxPersons || 10,
    available: a.available,
    deal: a.deal ?? null,
    verified: a.verified ?? false,
    ideal_for: a.idealFor || [],
    cuisine: a.cuisine ?? null,
    schedule: a.schedule ?? null,
    status: a.status ?? "approved",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const adminMode = url.searchParams.get("admin") === "true";
  const category = url.searchParams.get("category");
  const city = url.searchParams.get("city");
  const search = url.searchParams.get("search");

  let query = supabase.from("activities").select("*");
  if (!adminMode) query = query.eq("status", "approved");
  if (category && category !== "all") query = query.eq("category", category);
  if (city && city !== "all") query = query.eq("city", city);
  if (search) query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!data || data.length === 0) {
    if (!adminMode) {
      await supabase.from("activities").insert(
        defaultActivities.map((a) => activityToDb({ ...a, status: "approved" }))
      );
      return NextResponse.json(defaultActivities);
    }
    return NextResponse.json([]);
  }

  return NextResponse.json(data.map(dbToActivity));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from("activities")
    .insert([activityToDb({ ...body, status: "pending" })])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToActivity(data));
}
