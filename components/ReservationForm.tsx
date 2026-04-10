"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Phone, Shield } from "lucide-react";
import type { Listing } from "@/lib/data";
import { formatPrice, diffDays } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface Props {
  listing: Listing;
}

export default function ReservationForm({ listing }: Props) {
  const router = useRouter();
  const { t } = useT();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              {r.arrival}
            </label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              {r.departure}
            </label>
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none"
            />
          </div>
        </div>
        {listing.type !== "car" && (
          <div className="border-t border-gray-200 p-3">
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
      </div>

      <button
        onClick={handleReserve}
        disabled={!startDate || !endDate || days <= 0}
        className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {days > 0
          ? `${r.reserve} — ${days} ${days > 1 ? r.days_plural : r.days}`
          : r.chooseDates}
      </button>

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

      {/* Contact option */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          href={`https://wa.me/212${listing.owner.phone.slice(1)}`}
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

