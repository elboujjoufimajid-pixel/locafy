import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_EMAIL = "admin@rachra.com";
const DEFAULT_PASSWORD = "Utrecht2007@";

async function ensureAdminExists() {
  const { data } = await supabase.from("admin_settings").select("id").eq("id", 1).single();
  if (!data) {
    await supabase.from("admin_settings").insert([{ id: 1, email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }]);
  }
}

export async function GET() {
  try {
    await ensureAdminExists();
    const { data } = await supabase.from("admin_settings").select("email, password").eq("id", 1).single();
    return NextResponse.json(data || { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });
  } catch {
    return NextResponse.json({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });
  }
}

export async function POST(request: Request) {
  const { email, password } = await request.json();
  await ensureAdminExists();
  const { error } = await supabase
    .from("admin_settings")
    .update({ email, password })
    .eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
