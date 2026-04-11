"use client";

import { useState } from "react";
import { Phone, Shield, Clock, Users } from "lucide-react";
import type { Activity } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { addReservation } from "@/lib/adminStore";
import { getCurrentUser } from "@/lib/userAuth";

interface Props {
  activity: Activity;
}

const OCCASION_KEYS = ["normal", "romantic", "birthday", "familyDinner"] as const;

export default function ActivityBookingForm({ activity }: Props) {
  const { t } = useT();
  const b = t.activities.booking;
  const a = t.activities;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [persons, setPersons] = useState(activity.minPersons);
  const [occasion, setOccasion] = useState<typeof OCCASION_KEYS[number]>("normal");

  const discountedPrice = activity.deal
    ? Math.round(activity.pricePerPerson * (1 - activity.deal / 100))
    : activity.pricePerPerson;

  const subtotal = discountedPrice * persons;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  const today = new Date().toISOString().split("T")[0];

  function buildWhatsAppMessage() {
    const lines = [
      `Bonjour, je souhaite réserver :`,
      `📌 *${activity.title}*`,
      `📅 Date : ${date}`,
      ...(activity.category === "restaurant" && time ? [`⏰ Heure : ${time}`] : []),
      `👥 Personnes : ${persons}`,
      ...(activity.category === "restaurant" ? [`🎉 Occasion : ${b[occasion]}`] : []),
      `💰 Total : ${formatPrice(total)} MAD`,
      `📍 ${activity.city} — ${activity.address}`,
      ``,
      `Merci !`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  const canReserve = date && persons >= activity.minPersons && (activity.category !== "restaurant" || time);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
      <h3 className="font-bold text-gray-900 text-lg mb-1">{b.title}</h3>

      {/* Price header */}
      <div className="flex items-end gap-1 mb-4">
        <span className="text-2xl font-bold text-blue-700">{formatPrice(discountedPrice)}</span>
        <span className="text-gray-500 text-sm mb-0.5">{a.perPerson}</span>
        {activity.deal && (
          <span className="text-xs text-gray-400 line-through ml-2">
            {formatPrice(activity.pricePerPerson)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-5">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.duration}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {activity.minPersons}–{activity.maxPersons} {a.minMax}</span>
      </div>

      {/* Form */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 divide-y divide-gray-200">
        {/* Date */}
        <div className="p-3">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{b.date}</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-sm text-gray-700 outline-none"
          />
        </div>

        {/* Time — only for restaurants */}
        {activity.category === "restaurant" && (
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{b.time}</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none bg-white"
            >
              <option value="">--:--</option>
              {b.timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        )}

        {/* Persons */}
        <div className="p-3">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{b.persons}</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPersons(Math.max(activity.minPersons, persons - 1))}
              className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-blue-600 hover:text-blue-700 transition-colors font-bold"
            >-</button>
            <span className="text-sm font-semibold text-gray-800 w-8 text-center">{persons}</span>
            <button
              type="button"
              onClick={() => setPersons(Math.min(activity.maxPersons, persons + 1))}
              className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-blue-600 hover:text-blue-700 transition-colors font-bold"
            >+</button>
          </div>
        </div>

        {/* Occasion — only for restaurants */}
        {activity.category === "restaurant" && (
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{b.occasion}</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {OCCASION_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOccasion(key)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    occasion === key
                      ? "bg-blue-700 text-white border-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {b[key]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price breakdown */}
      {date && (
        <div className="mb-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>{formatPrice(discountedPrice)} {b.perPerson.replace("{n}", String(persons))}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{b.serviceFee}</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between font-bold text-gray-900">
            <span>{b.total}</span>
            <span className="text-blue-700">{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {/* WhatsApp reserve button */}
      <a
        href={canReserve ? `https://wa.me/212600287382?text=${buildWhatsAppMessage()}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
          canReserve
            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        onClick={(e) => {
          if (!canReserve) { e.preventDefault(); return; }
          const user = getCurrentUser();
          addReservation({
            listingTitle: activity.title,
            listingImage: activity.images[0],
            listingCity: activity.city,
            type: "activity",
            guest: user ? `${user.firstName} ${user.lastName}` : "Client WhatsApp",
            guestEmail: user?.email,
            phone: user?.phone || activity.owner.phone,
            startDate: date,
            endDate: date,
            total,
          });
        }}
      >
        <Phone className="w-4 h-4" />
        {canReserve ? b.confirm : b.chooseDateFirst}
      </a>

      {/* Direct WhatsApp contact */}
      <div className="mt-3">
        <a
          href={`https://wa.me/212600287382`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-gray-200 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          <Phone className="w-4 h-4 text-green-600" />
          {a.whatsapp}
        </a>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
        <Shield className="w-3 h-3" />
        <span>{b.securePayment}</span>
      </div>
    </div>
  );
}
