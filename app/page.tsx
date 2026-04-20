"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Star, Shield, Clock, BedDouble, Home, Car, Users, Zap, Compass, MapPin, X } from "lucide-react";
import DateRangePicker from "@/components/DateRangePicker";
import { CITIES } from "@/lib/data";
import { useRef } from "react";
import type { Listing } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import ActivityCard from "@/components/ActivityCard";
import { useT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/userAuth";
import type { UserProfile } from "@/lib/userAuth";
import { getRecentlyViewed } from "@/lib/recentlyViewedStore";
import type { Activity } from "@/lib/data";

type HeroTab = "logements" | "voitures" | "activites";

export default function HomePage() {
  const { t } = useT();
  const router = useRouter();
  const h = t.home;

  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState<HeroTab>("logements");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    fetch("/api/db/listings")
      .then((r) => r.json())
      .then((data) => setAllListings(Array.isArray(data) ? data : []));
    fetch("/api/db/activities")
      .then((r) => r.json())
      .then((data) => setFeaturedActivities(Array.isArray(data) ? data.slice(0, 3) : []));
  }, []);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const suggestions = destination.trim().length >= 1
    ? CITIES.filter(c => c.toLowerCase().includes(destination.toLowerCase())).slice(0, 6)
    : [];

  const featured = allListings.filter((l) => !l.deal).slice(0, 6);
  const deals = allListings.filter((l) => l.deal);

  const recentlyViewedIds = getRecentlyViewed();
  const recentlyViewed = recentlyViewedIds
    .map((id) => allListings.find((l) => l.id === id))
    .filter(Boolean) as typeof allListings;

  const today = new Date().toISOString().split("T")[0];

  const tabRoutes: Record<HeroTab, string> = {
    logements: "/listings",
    voitures: "/listings?type=car",
    activites: "/activities",
  };

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) params.set("search", destination);
    if (activeTab === "voitures") params.set("type", "car");
    const base = activeTab === "activites" ? "/activities" : "/listings";
    router.push(`${base}?${params.toString()}`);
  }

  const stats = [
    { label: h.stats.listings, value: "500+" },
    { label: h.stats.cities, value: "7" },
    { label: h.stats.rentals, value: "2,000+" },
    { label: h.stats.satisfaction, value: "98%" },
  ];

  const tabs: { id: HeroTab; label: string; icon: string }[] = [
    { id: "logements", label: h.tabLogements, icon: "🏠" },
    { id: "voitures", label: h.tabVoitures, icon: "🚗" },
    { id: "activites", label: h.tabActivites, icon: "🎯" },
  ];

  return (
    <div>
      {/* Hero — Booking.com style */}
      <section style={{ backgroundColor: "#003580" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pt-10 md:pb-16">

          {/* Category tabs */}
          <div className="flex items-center gap-1 mb-8 border-b border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-[#003580] border-b-2 border-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Title — personalized like Booking.com */}
          <div className="mb-5 md:mb-7">
            {user ? (
              <>
                <p className="text-blue-200 text-xs md:text-sm mb-1">{h.heroPersonalSubtitle}</p>
                <h1 className="text-2xl md:text-3xl font-extrabold mb-1 leading-tight">
                  {h.heroGreeting.replace("{name}", `${user.firstName || ""} ${user.lastName || ""}`.trim().toUpperCase())}
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-4xl font-bold mb-1">
                  {h.heroTitle}
                </h1>
                <p className="text-blue-200 text-sm md:text-base hidden sm:block">
                  {h.heroAnonSubtitle}
                </p>
              </>
            )}
          </div>

          {/* Search bar — yellow border like Booking.com */}
          <div
            className="flex flex-col md:flex-row rounded-lg shadow-xl overflow-visible"
            style={{ border: "3px solid #febb02" }}
          >
            {/* Destination with autocomplete */}
            <div ref={searchRef} className="relative flex items-center gap-3 bg-white px-4 py-3 flex-1 min-w-0 rounded-l-lg">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => { if (e.key === "Enter") { setShowSuggestions(false); handleSearch(); } }}
                placeholder={activeTab === "activites" ? h.searchActivity : h.searchWhere}
                className="w-full text-gray-800 text-sm outline-none placeholder:text-gray-400"
              />
              {destination && (
                <button onClick={() => { setDestination(""); setShowSuggestions(false); }}
                  className="text-gray-300 hover:text-gray-500 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  style={{ minWidth: 320 }}>
                  {suggestions.map((city) => (
                    <button
                      key={city}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setDestination(city);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100">
                        <MapPin className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{city}</p>
                        <p className="text-xs text-gray-400">Maroc</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Date range picker — hidden on mobile */}
            <div className="hidden md:block">
              <DateRangePicker
                checkin={checkin}
                checkout={checkout}
                onCheckin={setCheckin}
                onCheckout={setCheckout}
                days={h.days}
                months={h.months}
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Guests — hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 bg-white px-4 py-3 md:w-40">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">{h.persons}</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs hover:border-blue-600 transition-colors">−</button>
                  <span className="text-gray-800 text-sm font-medium">{guests}</span>
                  <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))}
                    className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs hover:border-blue-600 transition-colors">+</button>
                </div>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              style={{ backgroundColor: "#0071c2" }}
              className="text-white px-8 py-4 font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shrink-0 rounded-r-lg"
            >
              <Search className="w-4 h-4" />
              {h.search}
            </button>
          </div>

          {/* Quick links below search */}
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              { label: "Oujda", href: "/listings?city=Oujda" },
              { label: "Nador", href: "/listings?city=Nador" },
              { label: "Berkane", href: "/listings?city=Berkane" },
              { label: "Casablanca", href: "/listings?city=Casablanca" },
              { label: "Marrakech", href: "/listings?city=Marrakech" },
              { label: "Agadir", href: "/listings?city=Agadir" },
              { label: "Tanger", href: "/listings?city=Tanger" },
            ].map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="text-sm text-white/80 hover:text-white underline underline-offset-2 decoration-white/40 hover:decoration-white transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-blue-700">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{h.categories.title}</h2>
        <p className="text-gray-500 mb-8">{h.categories.subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/listings?type=apartment">
            <div className="group relative rounded-2xl overflow-hidden h-52 cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600" alt="Appartements" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <BedDouble className="w-5 h-5" />
                  <span className="font-bold text-xl">{h.categories.apartments}</span>
                </div>
                <span className="text-sm text-white/80">{h.categories.apartmentsSub}</span>
              </div>
            </div>
          </Link>
          <Link href="/listings?type=house">
            <div className="group relative rounded-2xl overflow-hidden h-52 cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600" alt="Maisons" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-5 h-5" />
                  <span className="font-bold text-xl">{h.categories.houses}</span>
                </div>
                <span className="text-sm text-white/80">{h.categories.housesSub}</span>
              </div>
            </div>
          </Link>
          <Link href="/listings?type=car">
            <div className="group relative rounded-2xl overflow-hidden h-52 cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600" alt="Voitures" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="w-5 h-5" />
                  <span className="font-bold text-xl">{h.categories.cars}</span>
                </div>
                <span className="text-sm text-white/80">{h.categories.carsSub}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* New types quick links */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Link href="/listings?type=parking">
            <div className="group flex items-center gap-4 bg-teal-50 border border-teal-100 rounded-2xl p-5 hover:bg-teal-100 transition-colors cursor-pointer">
              <span className="text-4xl">🅿️</span>
              <div>
                <p className="font-bold text-teal-800 text-base">Parking & Garages</p>
                <p className="text-teal-600 text-sm">Trouvez une place sécurisée</p>
              </div>
            </div>
          </Link>
          <Link href="/listings?type=local">
            <div className="group flex items-center gap-4 bg-amber-50 border border-amber-100 rounded-2xl p-5 hover:bg-amber-100 transition-colors cursor-pointer">
              <span className="text-4xl">🏪</span>
              <div>
                <p className="font-bold text-amber-800 text-base">Locaux commerciaux</p>
                <p className="text-amber-600 text-sm">Boutique, snack, bureau...</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-5 h-5 text-blue-700" />
            <span className="text-blue-700 font-semibold text-sm">Destinations populaires</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Où voulez-vous aller ?</h2>
          <p className="text-gray-500 mt-1">Découvrez les meilleures locations au Maroc</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { city: "Oujda", img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400", listings: allListings.filter(l => l.city === "Oujda").length },
            { city: "Nador", img: "https://images.unsplash.com/photo-1570721352060-8a5b8c71e936?w=400", listings: allListings.filter(l => l.city === "Nador").length },
            { city: "Marrakech", img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=400", listings: allListings.filter(l => l.city === "Marrakech").length },
            { city: "Agadir", img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400", listings: allListings.filter(l => l.city === "Agadir").length },
            { city: "Tanger", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400", listings: allListings.filter(l => l.city === "Tanger").length },
            { city: "Fès", img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400", listings: allListings.filter(l => l.city === "Fès").length },
            { city: "Casablanca", img: "https://images.unsplash.com/photo-1590156562745-5f671fd39a27?w=400", listings: allListings.filter(l => l.city === "Casablanca").length },
            { city: "Berkane", img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400", listings: allListings.filter(l => l.city === "Berkane").length },
          ].map((d) => (
            <Link key={d.city} href={`/listings?city=${d.city}`}>
              <div className="group relative rounded-2xl overflow-hidden h-36 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm">{d.city}</p>
                  <p className="text-white/70 text-xs">{d.listings > 0 ? `${d.listings} annonce${d.listings > 1 ? "s" : ""}` : "Disponible"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Je cherche banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <h2 className="text-xl font-bold mb-1">📋 Vous cherchez un bien à louer ?</h2>
            <p className="text-blue-200 text-sm">Publiez votre demande — les propriétaires vous contactent directement sur WhatsApp</p>
          </div>
          <Link
            href="/cherche/new"
            className="shrink-0 bg-[#febb02] text-[#003580] font-bold px-6 py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
          >
            Je cherche →
          </Link>
        </div>
      </section>

      {/* Activities section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-700" />
              <span className="text-blue-700 font-semibold text-sm">{h.categories.subtitle}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t.activities.homeSection.title}</h2>
            <p className="text-gray-500 mt-1">{t.activities.homeSection.subtitle}</p>
          </div>
          <Link href="/activities" className="text-blue-700 font-medium hover:text-blue-800 text-sm">
            {t.activities.homeSection.seeAll}
          </Link>
        </div>
        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/activities?category=outdoor">
            <div className="group relative rounded-2xl overflow-hidden h-44 cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1533470192478-9897d90d5461?w=600" alt="Outdoor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="font-bold text-xl">🏄 {t.activities.homeSection.outdoor}</span>
                <p className="text-sm text-white/80 mt-0.5">{t.activities.homeSection.outdoorSub}</p>
              </div>
            </div>
          </Link>
          <Link href="/activities?category=restaurant">
            <div className="group relative rounded-2xl overflow-hidden h-44 cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" alt="Restaurants" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="font-bold text-xl">🍽️ {t.activities.homeSection.restaurant}</span>
                <p className="text-sm text-white/80 mt-0.5">{t.activities.homeSection.restaurantSub}</p>
              </div>
            </div>
          </Link>
          <Link href="/activities?category=excursion">
            <div className="group relative rounded-2xl overflow-hidden h-44 cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600" alt="Excursions" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="font-bold text-xl">🗺️ {t.activities.homeSection.excursion}</span>
                <p className="text-sm text-white/80 mt-0.5">{t.activities.homeSection.excursionSub}</p>
              </div>
            </div>
          </Link>
        </div>
        {/* Featured activity cards */}
        <div className="flex flex-col gap-4">
          {featuredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Deals section */}
      {deals.length > 0 && (
        <section className="bg-orange-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">PROMO</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{h.deals.title}</h2>
                <p className="text-gray-500 mt-1">{h.deals.subtitle}</p>
              </div>
              <Link href="/listings" className="text-blue-700 font-medium hover:text-blue-800 text-sm">
                {h.featured.seeAll}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Vus récemment</h2>
              <p className="text-gray-500 text-sm">Continuez votre recherche</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.slice(0, 3).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{h.featured.title}</h2>
            <p className="text-gray-500">{h.featured.subtitle}</p>
          </div>
          <Link href="/listings" className="text-blue-700 font-medium hover:text-blue-800 text-sm">
            {h.featured.seeAll}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} showLastAvail={listing.id === "7"} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">{h.why.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: h.why.secure, desc: h.why.secureDesc },
              { icon: Star, title: h.why.verified, desc: h.why.verifiedDesc },
              { icon: Clock, title: h.why.fast, desc: h.why.fastDesc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{h.cta.title}</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">{h.cta.subtitle}</p>
          <Link href="/dashboard/new" className="inline-block bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            {h.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}

