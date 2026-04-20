import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { type, title, city, pricePerDay, ownerName, ownerPhone, brand, model, year, transmission, seats } = await req.json();

  const typeLabel = type === "car" ? "Voiture" : type === "apartment" ? "Appartement" : type === "house" ? "Maison" : type === "parking" ? "Parking/Garage" : type === "local" ? "Local commercial" : type;
  const carDetails = type === "car" ? `
    <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-top:12px;">
      <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">🚗 Détails voiture</p>
      <p style="color:#111827;font-size:14px;margin:0;">${brand || ""} ${model || ""} ${year || ""}</p>
      <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">${transmission || ""} — ${seats || ""} places</p>
    </div>` : "";

  try {
    await sendMail({
      to: "contact@rachra.com",
      subject: `🆕 Nouvelle annonce ${typeLabel} — ${title}`,
      html: `
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#003580;padding:28px 32px;text-align:center;">
      <p style="color:#ffffff;font-size:22px;font-weight:bold;margin:0;">Rachra<span style="color:#60a5fa;">.Com</span></p>
      <p style="color:#93c5fd;font-size:12px;margin:4px 0 0;">Nouvelle annonce soumise</p>
    </div>
    <div style="padding:32px;">
      <h1 style="color:#111827;font-size:20px;margin:0 0 20px;">Nouvelle annonce à approuver</h1>
      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Type: <strong style="color:#003580;">${typeLabel}</strong></p>
        <p style="font-weight:bold;color:#111827;margin:8px 0 4px;font-size:15px;">${title}</p>
        <p style="color:#6b7280;font-size:13px;margin:0;">📍 ${city}</p>
        <p style="color:#111827;font-size:14px;font-weight:600;margin:8px 0 0;">💰 ${pricePerDay} MAD / jour</p>
        ${carDetails}
        <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-top:12px;">
          <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">👤 ${ownerName}</p>
          <p style="color:#6b7280;font-size:13px;margin:0;">📞 ${ownerPhone}</p>
        </div>
      </div>
      <div style="text-align:center;">
        <a href="https://rachra.com/admin/listings" style="background:#003580;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;display:inline-block;">Voir dans l'admin</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Rachra.Com</p>
    </div>
  </div>
</body></html>`,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
