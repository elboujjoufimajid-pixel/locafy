import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("start_date", tomorrowStr)
    .eq("status", "confirmed");

  if (!reservations || reservations.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  for (const r of reservations) {
    if (!r.guest_email) continue;
    await sendMail({
      to: r.guest_email,
      subject: `⏰ Rappel — Votre séjour commence demain !`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:32px auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
        <h2 style="color:#1d4ed8;margin:0 0 16px;">Votre séjour commence demain ! 🏡</h2>
        <p style="color:#374151;font-size:15px;margin:0 0 16px;">Bonjour ${r.guest || ""},</p>
        <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;color:#374151;"><strong>Annonce:</strong> ${r.listing_title || ""}</p>
          <p style="margin:0 0 8px;color:#374151;"><strong>Arrivée:</strong> ${r.start_date}</p>
          <p style="margin:0 0 8px;color:#374151;"><strong>Départ:</strong> ${r.end_date}</p>
          <p style="margin:0;color:#374151;"><strong>Total:</strong> ${Number(r.total).toLocaleString("fr-MA")} MAD</p>
        </div>
        <p style="color:#6b7280;font-size:13px;">Besoin d'aide ? <a href="https://wa.me/212600287382" style="color:#16a34a;">WhatsApp</a></p>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">© 2026 Rachra.com 🇲🇦</p>
      </div>`,
    }).catch(() => {});
    sent++;
  }

  return NextResponse.json({ sent });
}
