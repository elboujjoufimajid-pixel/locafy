"use client";

import { useSearchParams } from "next/navigation";
import { getListingById } from "@/lib/adminStore";
import { CheckCircle2, MapPin, Download, Home } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { t } = useT();

  const reservationId = searchParams.get("reservationId");
  const listingId = searchParams.get("listingId");
  const total = Number(searchParams.get("total") || 0);
  const listing = listingId ? getListingById(listingId) : null;

  const s = t.success;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-blue-700" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{s.title}</h1>
        <p className="text-gray-500 mb-6">{s.subtitle}</p>

        {/* Reservation card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{s.resNumber}</span>
            <span className="font-bold text-blue-700 font-mono">{reservationId}</span>
          </div>

          {listing && (
            <div className="flex gap-3 items-center py-3 border-y border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-14 h-14 object-cover rounded-xl"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{listing.title}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.city}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">{s.totalPaid}</span>
            <span className="font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-blue-50 rounded-2xl p-5 text-left mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-sm">{s.nextSteps}</h3>
          <div className="space-y-2">
            {[
              { icon: "📧", text: s.step1 },
              { icon: "📱", text: s.step2 },
              { icon: "📋", text: s.step3 },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-blue-800">
                <span>{step.icon}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 w-full border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            {s.download}
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            {s.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-gray-400">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

