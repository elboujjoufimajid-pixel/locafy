"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/userAuth";
import { formatPrice } from "@/lib/utils";

interface Props {
  listingId: string;
  listingTitle: string;
  startDate: string;
  endDate: string;
  total: number;
}

const ADMIN_PHONE = "212600287382";

export default function CheckoutForm({ listingId, listingTitle, startDate, endDate, total }: Props) {
  const router = useRouter();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Save reservation to Supabase
    const res = await fetch("/api/db/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingTitle,
        listingId,
        type: "listing",
        guest: `${form.firstName} ${form.lastName}`,
        guestEmail: form.email,
        phone: form.phone,
        startDate,
        endDate,
        total,
      }),
    });
    const reservation = await res.json();

    // Notify admin via WhatsApp
    const msg = encodeURIComponent(
      `🔔 *Nouvelle réservation — Rachra.com*\n\n` +
      `📋 N° *${reservation.id}*\n` +
      `🏠 ${listingTitle}\n` +
      `👤 ${form.firstName} ${form.lastName}\n` +
      `📞 ${form.phone}\n` +
      `✉️ ${form.email}\n` +
      `📅 ${startDate} → ${endDate}\n` +
      `💰 *${formatPrice(total)}*`
    );
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${msg}`, "_blank");

    router.push(`/checkout/success?reservationId=${reservation.id}&total=${total}&listingId=${listingId}`);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-semibold text-gray-800 mb-3">Vos informations</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Prénom</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Mohamed" required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Benali" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="vous@email.com" required className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="06 XX XX XX XX" required className={inputClass} />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ Confirmation de réservation</p>
        <p className="text-xs text-blue-600">
          Votre réservation sera envoyée à l&apos;admin via WhatsApp. Vous serez contacté sous 24h pour confirmer et arranger le paiement.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
        ) : (
          <><MessageCircle className="w-4 h-4" /> Réserver — {formatPrice(total)}</>
        )}
      </button>
    </form>
  );
}
