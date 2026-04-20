"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Phone, Shield, Zap } from "lucide-react";
import type { Listing } from "@/lib/data";
import { formatPrice, diffDays } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import DateRangePicker from "@/components/DateRangePicker";

interface Props {
  listing: Listing;
}

export default function ReservationForm({ listing }: Props) {
  const router = useRouter();
  const { t } = useT();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/db/listings/${listing.id}/availability`)
      .then((r) => r.json())
      .then((d) => setBlockedDates(Array.isArray(d) ? d : []));
  }, [listing.id]);
  const [guests, setGuests] = useState(1);

  const days = startDate && endDate ? diffDays(startDate, endDate) : 0;
  const subtotal = days * listing.pricePerDay;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  function handleReserve() {
    if (!startDate || !endDate || days <= 0) return;
    const params = new URLSearchParams({
      listingId: listing.id,
      startDate,
      endDate,
      guests: guests.toString(),
      total: total.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  }

  const today = new Date().toISOString().split("T")[0];
  const r = t.reservation;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
      {/* Price header */}
      <div className="flex items-end gap-1 mb-1">
        <span className="text-2xl font-bold text-gray-900">
          {formatPrice(listing.pricePerDay)}
        </span>
        <span className="text-gray-500 text-sm mb-0.5">{r.perDay}</span>
      </div>
      {listing.pricePerMonth && (
        <p className="text-sm text-gray-500 mb-1">
          {r.perMonth.replace("{price}", formatPrice(listing.pricePerMonth))}
        </p>
      )}
      <div className="flex items-center gap-1 text-sm mb-5">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">{listing.rating}</span>
        <span className="text-gray-400">({listing.reviewCount} {r.reviews})</span>
      </div>

      {/* Date inputs */}
      <div className="mb-3">
        <DateRangePicker
          checkin={startDate}
          checkout={endDate}
          onCheckin={setStartDate}
          onCheckout={setEndDate}
          disabledDates={blockedDates}
        />
      </div>
      {listing.type !== "car" && (
        <div className="border border-gray-200 rounded-xl p-3 mb-3">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            {r.persons}
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-sm text-gray-700 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n > 1 ? r.persons_plural : r.person}
              </option>
            ))}
          </select>
        </div>
      )}

      {listing.instantBook ? (
        <button
          onClick={handleReserve}
          disabled={!startDate || !endDate || days <= 0}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-white" />
          {days > 0
            ? `Réserver maintenant — ${days} ${days > 1 ? r.days_plural : r.days}`
            : "Réservation instantanée"}
        </button>
      ) : (
        <button
          onClick={handleReserve}
          disabled={!startDate || !endDate || days <= 0}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {days > 0
            ? `${r.reserve} — ${days} ${days > 1 ? r.days_plural : r.days}`
            : r.chooseDates}
        </button>
      )}

      {/* Price breakdown */}
      {days > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              {formatPrice(listing.pricePerDay)} × {days} {days > 1 ? r.days_plural : r.days}
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{r.serviceFee}</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between font-bold text-gray-900">
            <span>{r.total}</span>
            <span className="text-blue-700">{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {/* WhatsApp Pay */}
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <a
          href={`https://wa.me/212600287382?text=${encodeURIComponent(`🏠 *Rachra.Com — Paiement*\n\n🏡 Bien: *${listing.title}* — ${listing.city}\n💰 Montant: *${formatPrice(total)}*\n\nJe souhaite payer cette réservation via virement.\nMerci de me confirmer les détails.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Payer via WhatsApp
        </a>
        <a
          href={`https://wa.me/212600287382`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-gray-200 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          <Phone className="w-4 h-4 text-green-600" />
          {r.whatsapp}
        </a>
      </div>

      {/* Trust */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
        <Shield className="w-3 h-3" />
        <span>{r.securePayment}</span>
      </div>
    </div>
  );
}

