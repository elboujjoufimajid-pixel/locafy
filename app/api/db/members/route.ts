import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";

export async function GET() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("joined_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data || []).map((m) => ({
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      phone: m.phone,
      role: m.role,
      joinedAt: m.joined_at,
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { error } = await supabase.from("members").upsert(
    {
      email: body.email,
      first_name: body.firstName,
      last_name: body.lastName,
      phone: body.phone || "",
      role: body.role || "client",
      joined_at: new Date().toISOString(),
    },
    { onConflict: "email", ignoreDuplicates: true }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send welcome email (fire & forget)
  if (body.firstName && body.email) {
    sendMail({
      to: body.email,
      subject: `Bienvenue sur Rachra.com, ${body.firstName} ! 🎉`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:32px auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
        <h1 style="color:#1d4ed8;margin:0 0 16px;">Marhba bik, ${body.firstName} ! 🎉</h1>
        <p style="color:#374151;font-size:15px;line-height:1.8;margin:0 0 20px;">
          Votre compte <strong>Rachra.com</strong> a été créé avec succès.<br>
          Explorez les meilleures locations au Maroc.
        </p>
        <a href="https://rachra.com/listings" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
          🔍 Explorer les annonces
        </a>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">© 2026 Rachra.com 🇲🇦</p>
      </div>`,
    }).catch(() => {});

    // Notify admin
    sendMail({
      to: "contact@rachra.com",
      subject: `👤 Nouveau membre — ${body.firstName} ${body.lastName || ""}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:32px auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
        <h2 style="color:#1d4ed8;margin:0 0 16px;">Nouveau membre inscrit</h2>
        <p style="margin:6px 0;color:#374151;"><strong>Nom:</strong> ${body.firstName} ${body.lastName || ""}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Email:</strong> ${body.email}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Rôle:</strong> ${body.role || "client"}</p>
      </div>`,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
