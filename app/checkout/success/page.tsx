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
  const commission = Math.round(total * 0.10);
  const ownerAmount = total - commission;
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

          <div className="pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{s.totalPaid}</span>
              <span className="font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Commission plateforme (10%)</span>
              <span className="text-orange-600 font-semibold">{formatPrice(commission)}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-2">
              <span className="text-gray-400">Montant propriétaire (90%)</span>
              <span className="text-green-600 font-semibold">{formatPrice(ownerAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment instructions */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left mb-4">
          <h3 className="font-semibold text-green-900 mb-3 text-sm flex items-center gap-2">
            💳 Finaliser le paiement
          </h3>
          <p className="text-xs text-green-700 mb-3">Effectuez un virement bancaire pour confirmer votre réservation :</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Banque</span>
              <span className="font-semibold text-gray-800">CIH Bank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">RIB</span>
              <span className="font-mono font-semibold text-gray-800 text-[11px]">230500283457821101640061</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">IBAN</span>
              <span className="font-mono font-semibold text-gray-800 text-[11px]">MA64230500283457821101640061</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Montant</span>
              <span className="font-bold text-green-700">{formatPrice(total)}</span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3 bg-green-100 rounded-lg p-2">
            📌 Mentionnez votre numéro de réservation <strong>{reservationId}</strong> dans le motif du virement.
          </p>
        </div>

        {/* WhatsApp contact */}
        <a
          href={`https://wa.me/212600287382?text=Bonjour, j'ai effectué une réservation N° ${reservationId} sur Rachra.Com. Montant: ${formatPrice(total)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Confirmer via WhatsApp
        </a>

        {/* Actions */}
        <div className="flex flex-col gap-3">
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

