"use client";

import { useSearchParams, notFound } from "next/navigation";
import { getListingById } from "@/lib/adminStore";
import { formatPrice, formatDate } from "@/lib/utils";
import { MapPin, Shield, CreditCard, Smartphone } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { useT } from "@/lib/i18n";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { t } = useT();

  const listingId = searchParams.get("listingId");
  if (!listingId) notFound();

  const listing = getListingById(listingId);
  if (!listing) notFound();

  const total = Number(searchParams.get("total") || 0);
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const guests = Number(searchParams.get("guests") || 1);

  const c = t.checkout;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{c.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — form */}
        <div className="space-y-6">
          {/* Trip details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">{c.yourTrip}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{c.dates}</span>
                <span className="font-medium text-gray-800">
                  {startDate && endDate
                    ? `${formatDate(startDate)} → ${formatDate(endDate)}`
                    : "—"}
                </span>
              </div>
              {listing.type !== "car" && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{c.persons}</span>
                  <span className="font-medium text-gray-800">
                    {guests} {guests > 1 ? c.persons_plural : c.person}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">{c.location}</span>
                <span className="font-medium text-gray-800 text-right max-w-[200px]">
                  {listing.city}
                </span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">{c.paymentMethod}</h2>
            <div className="grid grid-cols-1 gap-3 mb-5">
              <label className="flex items-center gap-3 p-3 border-2 border-blue-600 rounded-xl cursor-pointer bg-blue-50">
                <input type="radio" name="payment" defaultChecked className="accent-blue-700" />
                <CreditCard className="w-5 h-5 text-blue-700" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.card}</p>
                  <p className="text-xs text-gray-500">{c.cardSub}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
                <input type="radio" name="payment" className="accent-blue-700" />
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.transfer}</p>
                  <p className="text-xs text-gray-500">{c.transferSub}</p>
                </div>
              </label>
            </div>

            <CheckoutForm
              listingId={listing.id}
              startDate={startDate}
              endDate={endDate}
              total={total}
            />
          </div>

          {/* Security */}
          <div className="flex items-start gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p>{c.security}</p>
          </div>
        </div>

        {/* Right — summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <div className="flex gap-4 pb-5 border-b border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-xl shrink-0"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">{listing.title}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.city}</span>
                </div>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-gray-400">({listing.reviewCount})</span>
                </div>
              </div>
            </div>

            <div className="pt-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-900">{c.priceDetail}</h3>
              <div className="flex justify-between text-gray-600">
                <span>{formatPrice(listing.pricePerDay)}{t.listing.perDay}</span>
                <span>{formatPrice(Math.round(total / 1.05))}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{c.serviceFee}</span>
                <span>{formatPrice(total - Math.round(total / 1.05))}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>{c.total}</span>
                <span className="text-blue-700">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-800">
              {c.cancellation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-10 text-gray-400">Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

