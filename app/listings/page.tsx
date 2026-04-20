"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { CITIES } from "@/lib/data";
import type { Listing } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { SlidersHorizontal, ArrowUpDown, Map, List, X } from "lucide-react";
import ListingsFilters from "@/components/ListingsFilters";
import { useT } from "@/lib/i18n";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type SortKey = "recommended" | "priceAsc" | "priceDesc" | "rating";

function ListingsContent() {
  const searchParams = useSearchParams();
  const { t } = useT();
  const [sort, setSort] = useState<SortKey>("recommended");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [allResults, setAllResults] = useState<Listing[]>([]);

  const params = {
    type: searchParams.get("type") || undefined,
    city: searchParams.get("city") || undefined,
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
  };

  useEffect(() => {
    const qs = new URLSearchParams();
    if (params.type && params.type !== "all") qs.set("type", params.type);
    if (params.city && params.city !== "all") qs.set("city", params.city);
    if (params.search) qs.set("search", params.search);
    if (params.minPrice) qs.set("minPrice", params.minPrice);
    if (params.maxPrice) qs.set("maxPrice", params.maxPrice);
    fetch(`/api/db/listings?${qs.toString()}`)
      .then((r) => r.json())
      .then((data) => setAllResults(Array.isArray(data) ? data : []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  let results = [...allResults].sort((a, b) => {
    if (sort === "priceAsc") return a.pricePerDay - b.pricePerDay;
    if (sort === "priceDesc") return b.pricePerDay - a.pricePerDay;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const l = t.listings;
  const typeLabel =
    params.type === "apartment" ? l.apartments
    : params.type === "house" ? l.houses
    : params.type === "car" ? l.cars
    : params.type === "parking" ? "🅿️ Parking / Garages"
    : params.type === "local" ? "🏪 Locaux commerciaux"
    : l.all;

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "recommended", label: l.sortRecommended },
    { key: "priceAsc", label: l.sortPriceAsc },
    { key: "priceDesc", label: l.sortPriceDesc },
    { key: "rating", label: l.sortRating },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{typeLabel}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {results.length} {results.length > 1 ? l.foundPlural : l.found}
          {params.city && params.city !== "all" ? ` ${l.in} ${params.city}` : ` ${l.inOriental}`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile filter overlay */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-700" />
                  <h2 className="font-semibold text-gray-900">Filtres</h2>
                </div>
                <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <ListingsFilters cities={CITIES} current={params} onApply={() => setFiltersOpen(false)} />
            </div>
          </div>
        )}

        {/* Filters sidebar — desktop only */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              <h2 className="font-semibold text-gray-900">{t.filters.search}</h2>
            </div>
            <ListingsFilters cities={CITIES} current={params} />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>
              <p className="text-sm text-gray-500">{results.length} {results.length > 1 ? l.foundPlural : l.found}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Map / List toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "list" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <List className="w-4 h-4" /> Liste
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "map" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Map className="w-4 h-4" /> Carte
                </button>
              </div>
              {viewMode === "list" && (
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-600 bg-white cursor-pointer"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {viewMode === "map" ? (
            <MapView listings={results} />
          ) : results.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-medium text-lg text-gray-600">{l.noResults}</p>
              <p className="text-sm mt-2">{l.noResultsHint}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} horizontal={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-gray-400">Chargement...</div>}>
      <ListingsContent />
    </Suspense>
  );
}

