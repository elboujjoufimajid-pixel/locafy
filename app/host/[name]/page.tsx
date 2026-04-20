"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Listing } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { BadgeCheck, Star, MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";

export default function HostProfilePage() {
  const params = useParams();
  const ownerName = decodeURIComponent(params.name as string);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/db/listings")
      .then((r) => r.json())
      .then((data: Listing[]) => {
        const filtered = Array.isArray(data)
          ? data.filter((l) => l.owner.name === ownerName)
          : [];
        setListings(filtered);
        setLoading(false);
      });
  }, [ownerName]);

  const host = listings[0]?.owner;
  const avgRating = listings.length
    ? (listings.reduce((s, l) => s + l.rating, 0) / listings.length).toFixed(1)
    : null;
  const totalReviews = listings.reduce((s, l) => s + l.reviewCount, 0);
  const cities = [...new Set(listings.map((l) => l.city))];
  const isVerified = listings.some((l) => l.verified);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
        Chargement...
      </div>
    );
  }

  if (!host) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Hôte introuvable.</p>
        <Link href="/listings" className="text-blue-600 text-sm mt-3 inline-block hover:underline">
          ← Retour aux annonces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Host card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-md">
          {host.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{host.name}</h1>
            {isVerified && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5" />
                Propriétaire Vérifié
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-gray-500 mt-2 mb-4">
            {avgRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-800">{avgRating}</span>
                <span>({totalReviews} avis)</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">{listings.length}</span>
              <span>{listings.length > 1 ? "annonces" : "annonce"}</span>
            </div>
            {cities.length > 0 && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{cities.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Contact */}
          <a
            href={`https://wa.me/212${host.phone.replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Contacter via WhatsApp
          </a>
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Annonces de {host.name}
      </h2>
      {listings.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucune annonce disponible.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} horizontal />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/listings" className="text-blue-600 text-sm hover:underline">
          ← Voir toutes les annonces
        </Link>
      </div>
    </div>
  );
}
