"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Star, Shield, Clock, BedDouble, Home, Car, Users, CalendarDays, Zap } from "lucide-react";
import { getListings, getActivities } from "@/lib/adminStore";
import { CITIES } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import ActivityCard from "@/components/ActivityCard";
import { useT } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useT();
  const router = useRouter();
  const h = t.home;

  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);

  const allListings = getListings();
  const featured = allListings.filter((l) => !l.deal).slice(0, 6);
  const deals = allListings.filter((l) => l.deal);
  const featuredActivities = getActivities().slice(0, 3);
  const topCities = ["Casablanca", "Rabat", "Marrakech", "Agadir", "Tanger", "Fès", "Oujda"];

  const today = new Date().toISOString().split("T")[0];

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) params.set("search", destination);
    router.push(`/listings?${params.toString()}`);
  }

  const stats = [
    { label: h.stats.listings, value: "500+" },
    { label: h.stats.cities, value: "7" },
    { label: h.stats.rentals, value: "2,000+" },
    { label: h.stats.satisfaction, value: "98%" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-800 to-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">{h.region}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {h.heroTitle1}
              <br />
              <span className="text-blue-300">{h.heroTitle2}</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              {h.heroSubtitle}
            </p>

            {/* Booking-style search bar */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Destination */}
                <div className="flex items-center gap-3 px-4 py-3 flex-1">
                  <Search className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h.search}</p>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder={h.searchPlaceholder}
                      className="w-full text-gray-800 text-sm outline-none placeholder:text-gray-400 mt-0.5"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="flex items-center gap-3 px-4 py-3 md:w-40">
                  <CalendarDays className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h.checkin}</p>
                    <input
                      type="date"
                      min={today}
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                      className="w-full text-gray-800 text-sm outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex items-center gap-3 px-4 py-3 md:w-40">
                  <CalendarDays className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h.checkout}</p>
                    <input
                      type="date"
                      min={checkin || today}
                      value={checkout}
                      onChange={(e) => setCheckout(e.target.value)}
                      className="w-full text-gray-800 text-sm outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center gap-3 px-4 py-3 md:w-36">
                  <Users className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h.guests}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-5 h-5 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-xs hover:border-blue-600 hover:text-blue-700 transition-colors"
                      >-</button>
                      <span className="text-gray-800 text-sm font-medium w-4 text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-5 h-5 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-xs hover:border-blue-600 hover:text-blue-700 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="bg-blue-700 text-white px-8 py-4 font-semibold hover:bg-blue-800 transition-colors text-sm md:rounded-none flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {h.search}
                </button>
              </div>
            </div>

            {/* Quick city filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {topCities.map((city) => (
                <Link
                  key={city}
                  href={`/listings?city=${city}`}
                  className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                >
                  {city}
                </Link>
              ))}
            </div>
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

