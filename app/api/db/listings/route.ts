import { NextResponse } from "next/server";
import { supabase, dbToListing, listingToDb } from "@/lib/supabase";
import { listings as defaultListings } from "@/lib/data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const adminMode = url.searchParams.get("admin") === "true";
  const type = url.searchParams.get("type");
  const city = url.searchParams.get("city");
  const search = url.searchParams.get("search");
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");

  let query = supabase.from("listings").select("*");

  // Admin sees all; public sees only approved
  if (!adminMode) query = query.eq("status", "approved");

  if (type && type !== "all") query = query.eq("type", type);
  if (city && city !== "all") query = query.eq("city", city);
  if (minPrice) query = query.gte("price_per_day", Number(minPrice));
  if (maxPrice) query = query.lte("price_per_day", Number(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,description.ilike.%${q}%`);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If DB empty, auto-seed default listings
  if (!data || data.length === 0) {
    if (!adminMode && !type && !city && !search && !minPrice && !maxPrice) {
      await supabase.from("listings").insert(
        defaultListings.map((l) => listingToDb({ ...l, status: "approved" }))
      );
      return NextResponse.json(defaultListings.map((l) => ({ ...l, status: "approved" })));
    }
    return NextResponse.json([]);
  }

  return NextResponse.json(data.map(dbToListing));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from("listings")
    .insert([listingToDb({ ...body, status: "pending" })])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToListing(data));
}
