"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getFavorites } from "@/lib/favoritesStore";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/lib/data";
import Link from "next/link";

export default function FavorisPage() {
  const [favListings, setFavListings] = useState<Listing[]>([]);

  useEffect(() => {
    const favIds = getFavorites();
    if (favIds.length === 0) return;
    fetch("/api/db/listings")
      .then((r) => r.json())
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        setFavListings(all.filter((l: Listing) => favIds.includes(l.id)));
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 fill-red-500 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Mes favoris</h1>
        <span className="bg-gray-100 text-gray-600 text-sm px-2.5 py-0.5 rounded-full">{favListings.length}</span>
      </div>

      {favListings.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucun favori pour l'instant</p>
          <Link href="/listings" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
            Explorer les annonces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favListings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
