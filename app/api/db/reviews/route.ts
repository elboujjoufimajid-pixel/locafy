import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  if (!listingId) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json([]);
  return NextResponse.json((data || []).map((r) => ({
    id: r.id,
    listingId: r.listing_id,
    author: r.author,
    avatar: r.avatar,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  })));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase.from("reviews").insert([{
    listing_id: body.listingId,
    author: body.author,
    avatar: body.avatar,
    rating: body.rating,
    comment: body.comment,
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update listing rating
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("listing_id", body.listingId);

  if (allReviews && allReviews.length > 0) {
    const avg = allReviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / allReviews.length;
    await supabase.from("listings").update({
      rating: Math.round(avg * 10) / 10,
      review_count: allReviews.length,
    }).eq("id", body.listingId);
  }

  return NextResponse.json({ ok: true, id: data.id });
}
