import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { guestEmail, guestName, reservationId, listingTitle, listingCity, startDate, endDate, total } = await req.json();

  if (!guestEmail || !reservationId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await sendMail({
      to: guestEmail,
      subject: `✅ Réservation confirmée — ${reservationId}`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#003580;padding:28px 32px;text-align:center;">
      <p style="color:#ffffff;font-size:22px;font-weight:bold;margin:0;">Rachra<span style="color:#60a5fa;">.Com</span></p>
      <p style="color:#93c5fd;font-size:12px;margin:4px 0 0;">Your place, your way</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
          <span style="font-size:28px;">✅</span>
        </div>
        <h1 style="color:#111827;font-size:20px;margin:0 0 8px;">Réservation confirmée !</h1>
        <p style="color:#6b7280;font-size:14px;margin:0;">Bonjour ${guestName || ""},<br>votre paiement a été reçu et votre réservation est confirmée.</p>
      </div>

      <!-- Reservation details -->
      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="color:#6b7280;font-size:13px;">N° Réservation</span>
          <span style="color:#003580;font-weight:bold;font-size:13px;font-family:monospace;">${reservationId}</span>
        </div>
        <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-bottom:12px;">
          <p style="font-weight:bold;color:#111827;margin:0 0 4px;font-size:15px;">${listingTitle || ""}</p>
          <p style="color:#6b7280;font-size:13px;margin:0;">📍 ${listingCity || ""}</p>
        </div>
        <div style="border-top:1px solid #e5e7eb;padding-top:12px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#6b7280;font-size:13px;">📅 Dates</span>
            <span style="color:#111827;font-size:13px;font-weight:500;">${startDate} → ${endDate}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#6b7280;font-size:13px;">💰 Montant payé</span>
            <span style="color:#111827;font-size:15px;font-weight:bold;">${total?.toLocaleString("fr-MA")} MAD</span>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div style="background:#eff6ff;border-radius:12px;padding:16px;text-align:center;">
        <p style="color:#1e40af;font-size:13px;margin:0 0 8px;font-weight:600;">Une question ? Contactez-nous</p>
        <a href="https://wa.me/212600287382" style="color:#16a34a;text-decoration:none;font-size:13px;font-weight:500;">📞 WhatsApp : +212 600 287 382</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Rachra.Com — Oujda, Oriental, Maroc</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
