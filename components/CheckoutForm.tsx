"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { addReservation } from "@/lib/adminStore";
import { getListingById } from "@/lib/adminStore";
import { userLogin } from "@/lib/userAuth";

interface Props {
  listingId: string;
  startDate: string;
  endDate: string;
  total: number;
}

export default function CheckoutForm({ listingId, startDate, endDate, total }: Props) {
  const router = useRouter();
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));

    // Save user session
    userLogin(form.email, `${form.firstName} ${form.lastName}`, form.phone, "client");

    // Save reservation to admin store
    const listing = getListingById(listingId);
    const saved = addReservation({
      listingTitle: listing?.title || listingId,
      listingImage: listing?.images[0],
      listingCity: listing?.city,
      type: "listing",
      guest: `${form.firstName} ${form.lastName}`,
      guestEmail: form.email,
      phone: form.phone,
      startDate,
      endDate,
      total,
    });

    router.push(
      `/checkout/success?reservationId=${saved.id}&listingId=${listingId}&total=${total}`
    );
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition";

  const c = t.checkout;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Personal info */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">{c.personalInfo}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{c.firstName}</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder={c.firstNamePH}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{c.lastName}</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder={c.lastNamePH}
              required
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">{c.email}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="vous@email.com"
            required
            className={inputClass}
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">{c.phone}</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="06 XX XX XX XX"
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Card info */}
      <div className="pt-2">
        <p className="text-sm font-medium text-gray-700 mb-3">{c.paymentInfo}</p>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{c.cardNumber}</label>
          <input
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            required
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{c.expiry}</label>
            <input
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/AA"
              maxLength={5}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{c.cvv}</label>
            <input
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength={4}
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {c.processing}
          </>
        ) : (
          `${c.pay} ${total.toLocaleString("fr-MA")} MAD`
        )}
      </button>
    </form>
  );
}
