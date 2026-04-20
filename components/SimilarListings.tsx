"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Listing } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { getListings } from "@/lib/adminStore";

interface Props {
  currentId: string;
  city: string;
  type: string;
}

export default function SimilarListings({ currentId, city, type }: Props) {
  const similar = getListings()
    .filter((l) => l.id !== currentId && (l.city === city || l.type === type))
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vous aimerez aussi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {similar.map((l) => (
          <Link key={l.id} href={`/listings/${l.id}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={l.images[0]}
                alt={l.title}
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{l.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{l.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-bold text-sm">{formatPrice(l.pricePerDay)}<span className="text-gray-400 font-normal">/nuit</span></span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-700">{l.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
