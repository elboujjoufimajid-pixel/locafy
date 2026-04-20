"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, Calendar } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Suspense, useEffect } from "react";
import { getCurrentUser } from "@/lib/userAuth";
import { markReservationVerified } from "@/lib/verifiedReservationsStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId") || "";
  const total = Number(searchParams.get("total") || 0);
  const paid = searchParams.get("paid") === "stripe";
  const listingId = searchParams.get("listingId") || "";

  useEffect(() => {
    const user = getCurrentUser();
    if (listingId && user?.email) {
      markReservationVerified(listingId, user.email);
    }
  }, [listingId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full">

        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">

          {/* Icon */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {paid ? "Paiement confirmé !" : "Réservation reçue !"}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {paid
              ? "Votre paiement a été traité avec succès. Vous allez recevoir un email de confirmation."
              : "Votre réservation a été enregistrée et est en cours de traitement."}
          </p>

          {/* Reservation ID */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">N° Réservation</span>
              <span className="font-mono font-bold text-blue-700 text-sm">{reservationId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Montant payé</span>
              <span className="font-bold text-emerald-600 text-base">{formatPrice(total)}</span>
            </div>
            {paid && (
              <div className="mt-3 flex items-center gap-2 bg-emerald-50 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs text-emerald-700 font-medium">Paiement validé par Stripe</span>
              </div>
            )}
          </div>

          {/* What's next */}
          <div className="text-left mb-6 space-y-3">
            <p className="text-sm font-semibold text-gray-800">Prochaines étapes :</p>
            {[
              { icon: "📧", text: "Un email de confirmation vous a été envoyé" },
              { icon: "📞", text: "Le propriétaire vous contactera sous 24h" },
              { icon: "🔑", text: "Vous recevrez les instructions d'arrivée" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-base">{s.icon}</span>
                {s.text}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Voir mes réservations
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Besoin d&apos;aide ? Contactez-nous sur{" "}
          <a href="https://wa.me/212600287382" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
