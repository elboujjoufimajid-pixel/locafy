import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = body.page || "/";

    // Vercel geo headers
    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

    // Device detection from User-Agent
    const ua = request.headers.get("user-agent") || "";
    const device = /mobile|android|iphone|ipad/i.test(ua) ? "Mobile" : "Desktop";

    await supabase.from("visitors").insert([{ page, city, country, device }]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
