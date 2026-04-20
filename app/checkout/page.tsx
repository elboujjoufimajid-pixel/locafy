"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import type { Listing } from "@/lib/data";
import { formatPrice, formatDate } from "@/lib/utils";
import { MapPin, Shield, Star, LogIn, Tag, X } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { useT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/userAuth";
import Link from "next/link";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useT();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getCurrentUser());

  const listingId = searchParams.get("listingId") || "";
  const total = Number(searchParams.get("total") || 0);
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const guests = Number(searchParams.get("guests") || 1);

  useEffect(() => {
    setUser(getCurrentUser());
    if (!listingId) { setLoading(false); return; }
    fetch(`/api/db/listings/${listingId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setListing(data); setLoading(false); });
  }, [listingId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    const redirectUrl = `/checkout?${searchParams.toString()}`;
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Connectez-vous pour réserver</h2>
        <p className="text-gray-500 text-sm mb-6">
          Vous devez être connecté pour finaliser votre réservation.
        </p>
        <Link
          href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Se connecter
        </Link>
        <p className="mt-4 text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    );
  }

  if (!listing) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">Annonce introuvable.</p>
    </div>
  );

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; type: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  async function applyPromo() {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    const res = await fetch("/api/db/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode }),
    });
    const data = await res.json();
    if (!res.ok) { setPromoError(data.error || "Code invalide"); }
    else { setPromoApplied(data); }
    setPromoLoading(false);
  }

  const nights = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : 0;
  const basePrice = Math.round(total / 1.05);
  const serviceFee = total - basePrice;
  const discount = promoApplied
    ? promoApplied.type === "percent"
      ? Math.round(total * promoApplied.discount / 100)
      : promoApplied.discount
    : 0;
  const finalTotal = total - discount;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Finaliser votre réservation</h1>
      <p className="text-gray-500 text-sm mb-8">Paiement sécurisé · Confirmation immédiate</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Left — form (3/5) */}
        <div className="lg:col-span-3 space-y-5">

          {/* Trip details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Détails du séjour</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Arrivée</p>
                <p className="font-semibold text-gray-800">{startDate ? formatDate(startDate) : "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Départ</p>
                <p className="font-semibold text-gray-800">{endDate ? formatDate(endDate) : "—"}</p>
              </div>
              {listing.type !== "car" && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Voyageurs</p>
                  <p className="font-semibold text-gray-800">{guests} personne{guests > 1 ? "s" : ""}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Localisation</p>
                <p className="font-semibold text-gray-800">{listing.city}</p>
              </div>
            </div>
          </div>

          {/* Payment form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <CheckoutForm
              listingId={listing.id}
              listingTitle={listing.title}
              startDate={startDate}
              endDate={endDate}
              total={total}
            />
          </div>

          {/* Security */}
          <div className="flex items-start gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p>Vos données sont protégées. Nous utilisons un cryptage SSL 256-bit. Rachra.com ne stocke jamais vos données de carte.</p>
          </div>
        </div>

        {/* Right — summary (2/5) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">

            {/* Listing */}
            <div className="flex gap-4 pb-5 border-b border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.images[0]} alt={listing.title} className="w-20 h-20 object-cover rounded-xl shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{listing.title}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" /> {listing.city}
                </div>
                <div className="flex items-center gap-1 text-xs mt-1.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-gray-400">({listing.reviewCount} avis)</span>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pt-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-900">Détail du prix</h3>
              <div className="flex justify-between text-gray-600">
                <span>{formatPrice(listing.pricePerDay)} × {nights} nuit{nights > 1 ? "s" : ""}</span>
                <span>{formatPrice(basePrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de service (5%)</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <hr className="border-gray-100" />
              {/* Promo code */}
              {!promoApplied ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                    placeholder="Code promo"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoLoading}
                    className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="text-green-700 text-sm font-medium">✅ {promoApplied.code} — -{promoApplied.type === "percent" ? `${promoApplied.discount}%` : formatPrice(promoApplied.discount)}</span>
                  <button onClick={() => { setPromoApplied(null); setPromoCode(""); }} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-xs">{promoError}</p>}
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Réduction</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-blue-700">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Cancellation */}
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800">
              ✅ Annulation gratuite jusqu&apos;à 24h avant l&apos;arrivée
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
