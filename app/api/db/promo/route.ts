import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { code } = await request.json();
  if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single();

  if (error || !data) return NextResponse.json({ error: "Code invalide" }, { status: 404 });

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "Code expiré" }, { status: 400 });
  }

  if (data.max_uses && data.used_count >= data.max_uses) {
    return NextResponse.json({ error: "Code épuisé" }, { status: 400 });
  }

  return NextResponse.json({
    code: data.code,
    discount: data.discount,
    type: data.type, // "percent" or "fixed"
  });
}
