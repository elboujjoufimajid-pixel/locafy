"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { Listing } from "@/lib/data";
import { MapPin, Star, Wifi, Car, BedDouble, Bath, Maximize, Users, CheckCircle2, BadgeCheck, XCircle, Clock, PawPrint, Share2, Copy, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ReservationForm from "@/components/ReservationForm";
import ImageGallery from "@/components/ImageGallery";
import ReviewsSection from "@/components/ReviewsSection";
import SimilarListings from "@/components/SimilarListings";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { addRecentlyViewed } from "@/lib/recentlyViewedStore";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

export default function ListingDetailPage() {
  const params = useParams();
  const { t } = useT();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
  }, []);

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: listing?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  useEffect(() => {
    fetch(`/api/db/listings/${params.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setListing(data); setLoading(false); });
  }, [params.id]);

  useEffect(() => {
    if (listing) addRecentlyViewed(listing.id);
  }, [listing]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">Chargement...</div>;
  if (!listing) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Annonce introuvable.</div>;

  const l = t.listing;

  const amenityIcons: Record<string, string> = {
    WiFi: "📶",
    Climatisation: "❄️",
    Parking: "🅿️",
    Ascenseur: "🛗",
    Balcon: "🏗️",
    "Machine à laver": "🫧",
    Piscine: "🏊",
    Jardin: "🌿",
    Barbecue: "🔥",
    Garage: "🚗",
    Patio: "🏡",
    Terrasse: "🌅",
    GPS: "🗺️",
    Bluetooth: "📱",
    "Caméra recul": "📷",
    "Assurance incluse": "🛡️",
    "Kilométrage illimité": "♾️",
    "Vue mer": "🌊",
    "Cuisine équipée": "🍳",
    "Vue panoramique": "🏙️",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isAdmin && (
        <Link
          href={`/admin/listings/${listing.id}/edit`}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          ✏️ Modifier dans l&apos;admin
        </Link>
      )}
      {/* Title */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors shrink-0 mt-1"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copié !" : "Partager"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-800">{listing.rating}</span>
            <span>({listing.reviewCount} {l.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.address}, {listing.city}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <ImageGallery images={listing.images} title={listing.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900">
                  {l.by}{" "}
                  <span className="text-emerald-700">{listing.owner.name}</span>
                </h2>
                {listing.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Propriétaire Vérifié
                  </span>
                )}
              </div>
              {listing.type !== "car" && (
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  {listing.bedrooms && <span>{listing.bedrooms} {l.bedrooms}</span>}
                  {listing.bathrooms && <span>{listing.bathrooms} {l.bathrooms}</span>}
                  {listing.area && <span>{listing.area} m²</span>}
                </div>
              )}
              {listing.type === "car" && (
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  {listing.brand && <span>{listing.brand} {listing.model} {listing.year}</span>}
                  {listing.seats && <span>{listing.seats} {l.places}</span>}
                  {listing.transmission && <span>{listing.transmission}</span>}
                </div>
              )}
            </div>
            <Link
              href={`/host/${encodeURIComponent(listing.owner.name)}`}
              className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 hover:bg-emerald-700 transition-colors"
              title={`Voir le profil de ${listing.owner.name}`}
            >
              {listing.owner.avatar}
            </Link>
          </div>

          {/* Key features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
            {listing.type !== "car" && listing.bedrooms && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                <BedDouble className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-semibold text-gray-800">{listing.bedrooms}</span>
                <span className="text-xs text-gray-500">{l.bedrooms}</span>
              </div>
            )}
            {listing.type !== "car" && listing.bathrooms && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                <Bath className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-semibold text-gray-800">{listing.bathrooms}</span>
                <span className="text-xs text-gray-500">{l.bathrooms}</span>
              </div>
            )}
            {listing.type !== "car" && listing.area && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                <Maximize className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-semibold text-gray-800">{listing.area}</span>
                <span className="text-xs text-gray-500">m²</span>
              </div>
            )}
            {listing.type === "car" && listing.seats && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                <Users className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-semibold text-gray-800">{listing.seats}</span>
                <span className="text-xs text-gray-500">{l.places}</span>
              </div>
            )}
            {listing.type === "car" && listing.transmission && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                <Car className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-semibold text-gray-800 text-xs">{listing.transmission}</span>
                <span className="text-xs text-gray-500">{l.transmission}</span>
              </div>
            )}
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
              <Wifi className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="font-semibold text-gray-800 text-xs">{l.included}</span>
              <span className="text-xs text-gray-500">{l.equipment}</span>
            </div>
          </div>

          {/* Description */}
          <div className="pb-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{l.description}</h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Amenities */}
          <div className="pb-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{l.amenities}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listing.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{amenityIcons[a] || ""} {a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{l.location}</h2>
            <div className="flex items-start gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{listing.address}, {listing.city}, Maroc</span>
            </div>
            {listing.lat && listing.lng ? (
              <MiniMap lat={listing.lat} lng={listing.lng} title={listing.title} address={`${listing.address}, ${listing.city}`} />
            ) : (
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm">Carte — {listing.city}</p>
                </div>
              </div>
            )}
          </div>

          {/* Policies */}
          {listing.policies && (
            <div className="pb-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Règles & Politiques</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Annulation</p>
                    <p className="text-sm text-gray-800">{listing.policies.cancellation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Check-in / Check-out</p>
                    <p className="text-sm text-gray-800">Arrivée : {listing.policies.checkIn} · Départ : {listing.policies.checkOut}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-xl ${listing.policies.pets ? "bg-yellow-50" : "bg-red-50"}`}>
                  <PawPrint className={`w-5 h-5 shrink-0 mt-0.5 ${listing.policies.pets ? "text-yellow-600" : "text-red-500"}`} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Animaux</p>
                    <p className="text-sm text-gray-800">{listing.policies.pets ? "Animaux acceptés" : "Animaux non acceptés"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reservation card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ReservationForm listing={listing} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-2xl mt-4">
        <ReviewsSection listingId={listing.id} />
      </div>

      {/* Similar listings */}
      <SimilarListings currentId={listing.id} city={listing.city} type={listing.type} />
    </div>
  );
}
