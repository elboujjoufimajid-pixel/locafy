import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, role } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const roleLabel = role === "owner" ? "Propriétaire" : "Locataire";
    const roleEmoji = role === "owner" ? "🔑" : "🏠";

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bienvenue sur Rachra.com</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:40px 40px 30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:800;letter-spacing:-0.5px;">Rachra.com</h1>
              <p style="color:#bfdbfe;margin:8px 0 0;font-size:15px;">🇲🇦 La plateforme N°1 de location au Maroc</p>
            </td>
          </tr>

          <!-- Welcome message -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <h2 style="color:#111827;font-size:24px;margin:0 0 16px;">Marhba bik, ${firstName} ! 🎉</h2>
              <p style="color:#4b5563;font-size:15px;line-height:1.8;margin:0 0 12px;">
                Nous sommes vraiment ravis de vous accueillir dans la famille <strong>Rachra.com</strong> !
              </p>
              <p style="color:#4b5563;font-size:15px;line-height:1.8;margin:0 0 20px;">
                Votre compte a été créé avec succès en tant que <strong>${roleEmoji} ${roleLabel}</strong>.
                Vous faites maintenant partie d'une communauté marocaine qui facilite la location partout au Maroc.
              </p>

              <!-- Account details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Détails du compte</p>
                    <table width="100%" cellpadding="6" cellspacing="0">
                      <tr>
                        <td style="color:#9ca3af;font-size:13px;width:120px;">Nom complet</td>
                        <td style="color:#111827;font-size:13px;font-weight:600;">${firstName} ${lastName || ""}</td>
                      </tr>
                      <tr>
                        <td style="color:#9ca3af;font-size:13px;">Email</td>
                        <td style="color:#111827;font-size:13px;font-weight:600;">${email}</td>
                      </tr>
                      <tr>
                        <td style="color:#9ca3af;font-size:13px;">Compte</td>
                        <td style="color:#111827;font-size:13px;font-weight:600;">${roleEmoji} ${roleLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Features -->
              <p style="color:#374151;font-size:15px;font-weight:600;margin:0 0 14px;">Ce que vous pouvez faire sur Rachra.com :</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${role === "owner" ? `
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;background:#ede9fe;border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">🏠</td>
                      <td style="padding-left:12px;color:#374151;font-size:14px;">Publiez vos biens et commencez à recevoir des réservations</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;background:#dcfce7;border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">💰</td>
                      <td style="padding-left:12px;color:#374151;font-size:14px;">Gérez vos revenus et vos réservations depuis votre tableau de bord</td>
                    </tr></table>
                  </td>
                </tr>
                ` : `
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;background:#dbeafe;border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">🔍</td>
                      <td style="padding-left:12px;color:#374151;font-size:14px;">Recherchez des appartements, villas et voitures à louer</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;background:#fce7f3;border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">❤️</td>
                      <td style="padding-left:12px;color:#374151;font-size:14px;">Sauvegardez vos annonces favorites pour y revenir plus tard</td>
                    </tr></table>
                  </td>
                </tr>
                `}
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;background:#fef9c3;border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">⭐</td>
                      <td style="padding-left:12px;color:#374151;font-size:14px;">Laissez des avis après vos séjours et activités</td>
                    </tr></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Personal message -->
          <tr>
            <td style="padding:0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff,#f0fdf4);border-radius:12px;border:1px solid #dbeafe;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#1e40af;font-size:15px;font-weight:700;margin:0 0 8px;">💬 Un mot de notre équipe</p>
                    <p style="color:#374151;font-size:14px;line-height:1.8;margin:0;">
                      Chez <strong>Rachra.com</strong>, notre mission est simple : vous offrir la meilleure expérience de location au Maroc.
                      Que vous cherchiez un appartement à Casablanca, une villa à Agadir, ou une voiture à Oujda —
                      nous sommes là pour vous.
                    </p>
                    <p style="color:#374151;font-size:14px;line-height:1.8;margin:12px 0 0;">
                      Si vous avez la moindre question, notre équipe est disponible sur WhatsApp 24h/24. 🤝
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <a href="https://rachra.com/listings" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;margin-right:12px;">
                🔍 Explorer les annonces
              </a>
              <a href="https://wa.me/212600287382" style="display:inline-block;background:#22c55e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;">
                💬 WhatsApp
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 40px;text-align:center;">
              <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">
                Merci de nous faire confiance — L'équipe <strong>Rachra.com</strong> 🇲🇦
              </p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                © 2026 Rachra.com — La location au Maroc
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendMail({
      to: email,
      subject: `Bienvenue sur Rachra.com, ${firstName} ! 🎉`,
      html,
    });

    // Notify admin
    sendMail({
      to: "contact@rachra.com",
      subject: `👤 Nouveau membre — ${firstName} ${lastName || ""}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:32px auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
        <h2 style="color:#003580;margin:0 0 16px;">Nouveau membre inscrit</h2>
        <p style="margin:6px 0;color:#374151;"><strong>Nom:</strong> ${firstName} ${lastName || ""}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Email:</strong> ${email}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Rôle:</strong> ${roleEmoji} ${roleLabel}</p>
        <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;">© 2026 Rachra.com</p>
      </div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
