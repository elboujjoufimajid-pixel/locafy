import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  let query = supabase.from("reservations").select("*").order("created_at", { ascending: false });
  if (email) query = query.eq("guest_email", email);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data || []).map((r) => ({
      id: r.id,
      listingTitle: r.listing_title,
      listingImage: r.listing_image,
      listingCity: r.listing_city,
      type: r.type,
      guest: r.guest,
      guestEmail: r.guest_email,
      phone: r.phone,
      startDate: r.start_date,
      endDate: r.end_date,
      total: r.total,
      status: r.status,
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = `RES-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { data, error } = await supabase
    .from("reservations")
    .insert([{
      id,
      listing_title: body.listingTitle,
      listing_image: body.listingImage || null,
      listing_city: body.listingCity || null,
      type: body.type || "listing",
      guest: body.guest,
      guest_email: body.guestEmail || null,
      phone: body.phone,
      start_date: body.startDate,
      end_date: body.endDate,
      total: body.total,
      status: "pending",
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email confirmation au client
  if (body.guestEmail) {
    sendMail({
      to: body.guestEmail,
      subject: `✅ Réservation confirmée — ${id}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:32px auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
        <h1 style="color:#1d4ed8;margin:0 0 8px;">Réservation confirmée ✅</h1>
        <p style="color:#374151;font-size:15px;margin:0 0 20px;">Bonjour ${body.guest || ""},</p>
        <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;color:#374151;"><strong>N°</strong> <span style="color:#1d4ed8;font-family:monospace;">${id}</span></p>
          <p style="margin:0 0 8px;color:#374151;"><strong>Annonce:</strong> ${body.listingTitle || ""}</p>
          <p style="margin:0 0 8px;color:#374151;"><strong>Dates:</strong> ${body.startDate} → ${body.endDate}</p>
          <p style="margin:0;color:#374151;"><strong>Total:</strong> ${Number(body.total).toLocaleString("fr-MA")} MAD</p>
        </div>
        <p style="color:#6b7280;font-size:13px;">Vous serez contacté par l'admin sous 24h. <a href="https://wa.me/212600287382" style="color:#16a34a;">WhatsApp</a></p>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">© 2026 Rachra.com 🇲🇦</p>
      </div>`,
    }).catch(() => {});

    // Notif admin
    sendMail({
      to: "contact@rachra.com",
      subject: `🔔 Nouvelle réservation — ${id}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:32px auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
        <h2 style="color:#1d4ed8;margin:0 0 16px;">Nouvelle réservation</h2>
        <p style="margin:6px 0;color:#374151;"><strong>N°:</strong> ${id}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Annonce:</strong> ${body.listingTitle || ""}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Client:</strong> ${body.guest || ""}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Email:</strong> ${body.guestEmail}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Tél:</strong> ${body.phone || ""}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Dates:</strong> ${body.startDate} → ${body.endDate}</p>
        <p style="margin:6px 0;color:#374151;"><strong>Total:</strong> ${Number(body.total).toLocaleString("fr-MA")} MAD</p>
        <a href="https://rachra.com/admin/reservations" style="display:inline-block;margin-top:16px;background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;">Voir dans l'admin</a>
      </div>`,
    }).catch(() => {});
  }

  return NextResponse.json({
    id: data.id,
    listingTitle: data.listing_title,
    listingImage: data.listing_image,
    listingCity: data.listing_city,
    type: data.type,
    guest: data.guest,
    guestEmail: data.guest_email,
    phone: data.phone,
    startDate: data.start_date,
    endDate: data.end_date,
    total: data.total,
    status: data.status,
  });
}
