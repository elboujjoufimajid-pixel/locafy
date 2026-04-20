"use client";

import Link from "next/link";
import { MapPin, BedDouble, Car, Home, Heart, BadgeCheck, Star, Zap, ParkingCircle, Store } from "lucide-react";
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

const typeIcons = { apartment: BedDouble, house: Home, car: Car, parking: ParkingCircle, local: Store };
const typeLabelsMap = { apartment: "Appartement", house: "Maison", car: "Voiture", parking: "Parking", local: "Local" };
const typeColors = {
  apartment: "bg-blue-100/90 text-blue-700",
  house: "bg-violet-100/90 text-violet-700",
  car: "bg-orange-100/90 text-orange-700",
  parking: "bg-teal-100/90 text-teal-700",
  local: "bg-amber-100/90 text-amber-700",
};

function ScoreBadge({ rating }: { rating: number }) {
  const color = rating >= 9 ? "bg-blue-700" : rating >= 8 ? "bg-blue-600" : rating >= 7 ? "bg-teal-600" : "bg-yellow-500";
  const label = rating >= 9 ? "Exceptionnel" : rating >= 8 ? "Superbe" : rating >= 7 ? "Très bien" : "Bien";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`${color} text-white text-sm font-bold px-2 py-1 rounded-lg leading-none`}>{rating}</span>
    </div>
  );
}

export default function ListingCard({ listing, showLastAvail = false, horizontal = false }: Props) {
  const { t } = useT();
  const Icon = typeIcons[listing.type] ?? Home;
  const discountedPrice = listing.deal ? Math.round(listing.pricePerDay * (1 - listing.deal / 100)) : null;
  const [fav, setFav] = useState(false);
  useEffect(() => { setFav(isFavorite(listing.id)); }, [listing.id]);

  function handleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(listing.id));
  }

  // ─── HORIZONTAL card (listing page) ──────────────────────────────────────
  if (horizontal) {
    return (
      <Link href={`/listings/${listing.id}`}>
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col sm:flex-row cursor-pointer">
          {/* Image */}
          <div className="relative w-full h-52 sm:w-64 sm:h-auto shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 ${typeColors[listing.type]}`}>
                <Icon className="w-3 h-3" />
                {typeLabelsMap[listing.type]}
              </span>
              {listing.deal && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{listing.deal}%</span>
              )}
              {!listing.deal && listing.availableRooms && listing.availableRooms <= 3 && (
                <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Plus que {listing.availableRooms} !</span>
              )}
              {showLastAvail && !listing.deal && !listing.availableRooms && (
                <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{t.card.lastAvail}</span>
              )}
            </div>
            {/* Fav */}
            <button onClick={handleFav} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform z-10">
              <Heart className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3 flex-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {listing.title}
                </h3>
                {listing.verified && (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mb-2">
                    <BadgeCheck className="w-3.5 h-3.5" /> Propriétaire Vérifié
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{listing.city}</span>
                  {listing.type !== "car" && listing.bedrooms && <span className="ml-1">· {listing.bedrooms} ch.</span>}
                  {listing.type !== "car" && listing.area && <span>· {listing.area} m²</span>}
                  {listing.type === "car" && listing.brand && <span className="ml-1">· {listing.brand} {listing.model}</span>}
                </div>
                {/* Amenities preview */}
                {listing.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {listing.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                    {listing.amenities.length > 3 && (
                      <span className="text-xs text-gray-400">+{listing.amenities.length - 3}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Annulation gratuite disponible
                </div>
                {listing.instantBook && (
                  <div className="flex items-center gap-1 text-xs text-blue-700 font-semibold mt-1">
                    <Zap className="w-3 h-3 fill-blue-700" />
                    Réservation instantanée
                  </div>
                )}
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <ScoreBadge rating={listing.rating} />
                <span className="text-xs text-gray-400">{listing.reviewCount} avis</span>
                <div className="mt-auto text-right">
                  {discountedPrice ? (
                    <>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(listing.pricePerDay)}</p>
                      <p className="text-xl font-extrabold text-blue-700">{formatPrice(discountedPrice)}</p>
                    </>
                  ) : (
                    <p className="text-xl font-extrabold text-blue-700">{formatPrice(listing.pricePerDay)}</p>
                  )}
                  <p className="text-xs text-gray-400">{listing.priceUnit === "month" ? "/ mois" : t.card.perDay}</p>
                </div>
                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Voir →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ─── GRID card (homepage) ──────────────────────────────────────────────
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Top left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 ${typeColors[listing.type]}`}>
              <Icon className="w-3 h-3" />
              {typeLabelsMap[listing.type]}
            </span>
            {listing.deal && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">-{listing.deal}%</span>
            )}
            {!listing.deal && listing.availableRooms && listing.availableRooms <= 3 && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">Plus que {listing.availableRooms} !</span>
            )}
          </div>

          {/* Fav button */}
          <button onClick={handleFav} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform z-10">
            <Heart className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>

          {/* Bottom score */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-bold">{listing.rating}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">
            {listing.title}
          </h3>
          {listing.verified && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mb-1.5">
              <BadgeCheck className="w-3.5 h-3.5" /> Vérifié
            </div>
          )}
          {listing.instantBook && (
            <div className="flex items-center gap-1 text-blue-700 text-xs font-semibold mb-1.5">
              <Zap className="w-3 h-3 fill-blue-700" /> Réservation instantanée
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{listing.city}</span>
            {listing.type !== "car" && listing.bedrooms && <span>· {listing.bedrooms} ch.</span>}
            {listing.type !== "car" && listing.area && <span>· {listing.area} m²</span>}
            {listing.type === "car" && listing.brand && <span>· {listing.brand} {listing.model}</span>}
          </div>

          {/* Push price to bottom */}
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
            <div>
              {discountedPrice ? (
                <>
                  <span className="text-xs text-gray-400 line-through block">{formatPrice(listing.pricePerDay)}</span>
                  <span className="text-blue-700 font-extrabold text-lg">{formatPrice(discountedPrice)}</span>
                </>
              ) : (
                <span className="text-blue-700 font-extrabold text-lg">{formatPrice(listing.pricePerDay)}</span>
              )}
              <span className="text-gray-400 text-xs ml-1">{listing.priceUnit === "month" ? "/ mois" : t.card.perDay}</span>
            </div>
            <span className="text-xs text-gray-400">{listing.reviewCount} avis</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
