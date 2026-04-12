"use client";

import Link from "next/link";
import { MapPin, BedDouble, Car, Home, Heart } from "lucide-react";
import type { Listing } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/lib/favoritesStore";

interface Props {
  listing: Listing;
  showLastAvail?: boolean;
  horizontal?: boolean;
}

const typeIcons = { apartment: BedDouble, house: Home, car: Car };
const typeColors = {
  apartment: "bg-blue-100 text-blue-700",
  house: "bg-purple-100 text-purple-700",
  car: "bg-orange-100 text-orange-700",
};

function getScoreBadge(rating: number, labels: { exceptional: string; superb: string; veryGood: string; good: string }) {
  if (rating >= 9) return { label: labels.exceptional, bg: "bg-blue-700" };
  if (rating >= 8) return { label: labels.superb, bg: "bg-blue-600" };
  if (rating >= 7) return { label: labels.veryGood, bg: "bg-teal-600" };
  return { label: labels.good, bg: "bg-yellow-500" };
}

export default function ListingCard({ listing, showLastAvail = false, horizontal = false }: Props) {
  const { t } = useT();
  const Icon = typeIcons[listing.type];
  const score = getScoreBadge(listing.rating, t.card.scoreLabels);
  const typeLabels = { apartment: t.nav.apartments, house: t.nav.houses, car: t.nav.cars };
  const discountedPrice = listing.deal ? Math.round(listing.pricePerDay * (1 - listing.deal / 100)) : null;
  const [fav, setFav] = useState(false);
  useEffect(() => { setFav(isFavorite(listing.id)); }, [listing.id]);

  function handleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(listing.id));
  }

  if (horizontal) {
    return (
      <Link href={`/listings/${listing.id}`}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer border border-gray-100 flex">
          {/* Image */}
          <div className="relative w-56 shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {listing.deal && (
              <div className="absolute top-3 left-3">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{listing.deal}%
                </span>
              </div>
            )}
            {showLastAvail && !listing.deal && (
              <div className="absolute top-3 left-3">
                <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {t.card.lastAvail}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${typeColors[listing.type]}`}>
                    <Icon className="w-3 h-3" />
                    {typeLabels[listing.type]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 leading-tight mb-1 text-base">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{listing.city}</span>
                  {listing.type !== "car" && listing.bedrooms && (
                    <span className="ml-2">· {listing.bedrooms} {t.listing.bedrooms}</span>
                  )}
                  {listing.type !== "car" && listing.area && (
                    <span>· {listing.area} m²</span>
                  )}
                  {listing.type === "car" && listing.brand && (
                    <span className="ml-2">· {listing.brand} {listing.model} {listing.year}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-blue-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                  {t.card.freeCancellation}
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 text-right">{score.label}</span>
                  <span className={`${score.bg} text-white text-sm font-bold px-2 py-1 rounded-lg`}>
                    {listing.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{listing.reviewCount} {t.card.reviews}</span>
              </div>
            </div>

            {/* Price — pushed to bottom */}
            <div className="mt-auto pt-3 flex items-end justify-end">
              <div className="text-right">
                {discountedPrice ? (
                  <>
                    <span className="text-xs text-gray-400 line-through block">
                      {formatPrice(listing.pricePerDay)}
                    </span>
                    <span className="text-blue-700 font-bold text-xl">
                      {formatPrice(discountedPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-blue-700 font-bold text-xl">
                    {formatPrice(listing.pricePerDay)}
                  </span>
                )}
                <span className="text-gray-400 text-sm">{t.card.perDay}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid card (homepage)
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer border border-gray-100 h-full flex flex-col">
        <div className="relative h-52 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${typeColors[listing.type]}`}>
              <Icon className="w-3 h-3" />
              {typeLabels[listing.type]}
            </span>
          </div>
          <button onClick={handleFav} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform z-10">
            <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
          {listing.deal && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{listing.deal}%
              </span>
            </div>
          )}
          {showLastAvail && !listing.deal && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {t.card.lastAvail}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1 mb-1">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
            <MapPin className="w-3 h-3" />
            <span>{listing.city}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            {listing.type !== "car" && listing.bedrooms && <span>{listing.bedrooms} {t.listing.bedrooms.slice(0, 2)}.</span>}
            {listing.type !== "car" && listing.area && <span>{listing.area} m²</span>}
            {listing.type === "car" && listing.brand && <span>{listing.brand} {listing.model} {listing.year}</span>}
            {listing.type === "car" && listing.transmission && <span>{listing.transmission}</span>}
          </div>
          <div className="mb-3">
            <span className="text-xs text-blue-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              {t.card.freeCancellation}
            </span>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <div>
              {discountedPrice ? (
                <>
                  <span className="text-xs text-gray-400 line-through mr-1">{formatPrice(listing.pricePerDay)}</span>
                  <span className="text-blue-700 font-bold text-base">{formatPrice(discountedPrice)}</span>
                </>
              ) : (
                <span className="text-blue-700 font-bold text-base">{formatPrice(listing.pricePerDay)}</span>
              )}
              <span className="text-gray-400 text-xs">{t.card.perDay}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">{listing.reviewCount} {t.card.reviews}</span>
              <span className={`${score.bg} text-white text-xs font-bold px-2 py-0.5 rounded-lg`}>{listing.rating}</span>
            </div>
          </div>
          <div className="text-right mt-0.5">
            <span className="text-xs text-gray-400">{score.label}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
